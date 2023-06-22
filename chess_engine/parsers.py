import io

import config
import utils
from utils import (encode_move, generate_castling_moves, generate_moves,
                   get_bishop_attacks, get_bit, get_move_promoted_piece,
                   get_move_source, get_move_target, get_queen_attacks,
                   get_rook_attacks, make_move, print_board, search_position)

################################################
##                                            ##
##             UCI Protocol Parser            ##
##                                            ##
################################################


def uci_loop():
    ENGINE_INFO = f"id name MBC\n" f"id author Mike Bams Chess\n" f"uciok"

    # Start the main loop
    while True:
        user_input = input().strip()
        if not user_input.strip():
            continue
        command_list = user_input.split()
        if command_list[0].lower() == "isready":
            print("readyok")

        elif command_list[0].lower() == "position":
            parse_position(user_input, command_list=command_list)
            # Clear transposition table
            utils.clear_transposition_table()

        elif command_list[0].lower() == "go":
            parse_go(user_input, command_list=command_list)

        elif command_list[0].lower() == "ucinewgame":
            parse_position("position startpos")
            # Clear transposition table
            utils.clear_transposition_table()

        elif command_list[0].lower() == "uci":
            print(ENGINE_INFO)

        elif command_list[0].lower() == "quit":
            return


def parse_position(command: str, command_list: list = None):
    """
    Parses the UCI Protocol 'position' command

    Examples:
        - position startpos
        - position startpos moves e2e4 e7e5
        - position fen r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1
        - position fen r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1 moves e2a6 e8g8
    """
    if command_list is None:
        command_list = command.strip().split()
    n = len(command_list)

    if n < 2:
        return

    if command_list[1].lower() == "startpos":
        # We want to initialise to the starting position
        parse_fen(config.START_POSITION)
    else:
        if command_list[1].lower() != "fen":
            # An invalid command was passed; our fallback is to initialise the starting position
            parse_fen(config.START_POSITION)
            print(
                f"!!!!!! INVALID COMMAND PASSED (SHOULD BE fen): {command} !!!!!!\n\n"
                f"INITIALISING WITH START POSITION INSTEAD"
            )
            return
        FEN = " ".join(command_list[2:6])
        parse_fen(FEN)
    # Parse the moves if exists
    move_command = None
    # The 'moves' command has to be within the first 10
    # entries of the command list
    for i in range(10):
        if i < n and command_list[i].lower() == "moves":
            move_command = i
            break
    if move_command is not None:
        for move_idx in range(move_command + 1, n):
            move = parse_move(command_list[move_idx])
            if move is not None:
                # First increment repetition index and add current position
                # to repetition table
                config.REPETITION_INDEX += 1
                config.REPETITON_TABLE[config.REPETITION_INDEX] = config.HASH_KEY
                make_move(move)
            else:
                print(f"!!! INVALID MOVE: {command_list[move_idx]} !!!")
    print_board()


def parse_go(command: str, command_list: list = None):
    """
    Parses the UCI Protocol 'go depth' command
    which is used to search a given position

    Example: go depth 6 wtime 180000 btime 180000 binc 1000 winc 1000 movetime 1000 movetogo 40
    """
    # Start by resetting all relevant UCI time control variables
    config.UCI_QUIT = 0
    config.UCI_MOVES_TO_GO = 30
    config.UCI_MOVE_TIME = -1
    config.UCI_TIME = -1
    config.UCI_INCREMENT_TIME = 0
    config.UCI_START_TIME = 0
    config.UCI_STOP_TIME = 0
    config.UCI_TIME_IS_SET = False
    config.UCI_STOPPED = 0

    if command_list is None:
        command_list = command.strip().split()
    n = len(command_list)

    if n < 3 or command_list[0].lower() != "go":
        print(f"!!!!!! INVALID COMMAND PASSED: {command} !!!!!!")
        return

    # We have a default depth just in case
    depth = config.MAX_DEPTH

    # Pointer to walk through the command list
    pointer = 0
    while pointer < n:
        cmnd = command_list[pointer]

        if cmnd == "infinite":
            # Nothing to do here since our default
            # flag for this (UCI_time_is_set) is already set to false
            pointer += 2

        elif cmnd == "depth":
            try:
                depth = int(command_list[pointer + 1])
            except ValueError:
                # Use the configured max depth
                print(f"Searching fixed depth {config.MAX_DEPTH}")
            pointer += 2

        elif (cmnd == "binc" and config.SIDE_TO_MOVE == "black") or (
            cmnd == "winc" and config.SIDE_TO_MOVE == "white"
        ):
            config.UCI_INCREMENT_TIME = int(command_list[pointer + 1])
            pointer += 2

        elif (cmnd == "btime" and config.SIDE_TO_MOVE == "black") or (
            cmnd == "wtime" and config.SIDE_TO_MOVE == "white"
        ):
            config.UCI_TIME = int(command_list[pointer + 1])
            pointer += 2

        elif cmnd == "movestogo":
            config.UCI_MOVES_TO_GO = int(command_list[pointer + 1])
            pointer += 2

        elif cmnd == "movetime":
            config.UCI_MOVE_TIME = int(command_list[pointer + 1])
            pointer += 2

        else:
            pointer += 1

    # Update UCI parameters based on what we've parsed here

    if config.UCI_MOVE_TIME != -1:
        # Set UCI_Time to be the given move time
        config.UCI_TIME = config.UCI_MOVE_TIME
        # Set moves_to_go to 1. This'll come in handy when we're tweaking
        # UCI_time later below. The logic is that if we have a move time specified
        # then we don't need to worry about how many moves we still have to play
        # in the game within the time control set, so we just divide by 1
        config.UCI_MOVES_TO_GO = 1

    # Init the start time
    config.UCI_START_TIME = utils.get_time_ms()

    if config.UCI_TIME != -1:
        # We're searching with time
        config.UCI_TIME_IS_SET = True
        # Tweak the time taking into account moves_to_go
        config.UCI_TIME //= config.UCI_MOVES_TO_GO
        # A little insurance so we don't go over the time we have: reduce UCI_time by 50 ms
        config.UCI_TIME -= 50
        # Now we set the stop time our search function will be working with
        config.UCI_STOP_TIME = (
            config.UCI_START_TIME + config.UCI_TIME + config.UCI_INCREMENT_TIME
        )

    print(
        f"time:{config.UCI_TIME} start:{config.UCI_START_TIME} "
        f"stop:{config.UCI_STOP_TIME} depth:{depth} "
        f"timeset:{1 if config.UCI_TIME_IS_SET else 0}"
    )

    search_position(depth)


################################################
##                                            ##
##          FEN parser and generator          ##
##                                            ##
################################################


def generate_FEN_from_board_state():
    """
    Given the current board state,
    we generate its corresponding FEN string.
    """

    FEN_string = io.StringIO("")
    for r in range(8):
        empty = 0
        for f in range(8):
            square = r * 8 + f
            occ = utils.get_bit(config.OCCUPANCIES[2], square)
            if occ:
                # Not an empty square
                if empty:
                    # Write the last sequence of empty squares to the FEN string
                    FEN_string.write(str(empty))

                # Reset the empty squares count to zero
                empty = 0

                # Determine which colour piece we have
                # Offset to the PIECE_BITBOARDS is 6 for black and 0 for white
                offset = 6
                if utils.get_bit(config.OCCUPANCIES[0], square):
                    offset = 0

                # Determine which piece we have
                for i in range(6):
                    if utils.get_bit(config.PIECE_BITBOARDS[i + offset], square):
                        # Add the piece to the FEN string
                        FEN_string.write(config.ASCII_PIECES[i + offset])
                        break

            else:
                # Empty square; update the empty squares count
                empty += 1

        if empty:
            # Add whatever empty squares, if any, are at the end of the rank
            FEN_string.write(str(empty))
        if r != 7:
            # Add the new rank delimiter
            FEN_string.write("/")

    FEN_string.write(" ")

    # Add side to move
    stm = "w " if config.SIDE_TO_MOVE == "white" else "b "
    FEN_string.write(stm)

    # Add castling rights
    if not config.CASTLING_RIGHT:
        FEN_string.write("- ")
    else:
        K = "K" if config.CASTLING_RIGHT & 8 else "-"
        Q = "Q" if config.CASTLING_RIGHT & 4 else "-"
        k = "k" if config.CASTLING_RIGHT & 2 else "-"
        q = "q" if config.CASTLING_RIGHT & 1 else "-"
        FEN_string.write(K + Q + k + q + " ")

    # Add en passant square
    if config.ENPASSANT_SQUARE == "no_square":
        FEN_string.write("- ")
    else:
        FEN_string.write(config.ENPASSANT_SQUARE + " ")

    # Add move counts
    # For now, we just add 0 and 1
    FEN_string.write("0 1")

    # Get the FEN string
    fen_string = FEN_string.getvalue()

    # Close the buffer
    FEN_string.close()

    return fen_string


def parse_fen(FEN: str):
    # First thing to do is to reset all board
    # variables that can be impacted by the
    # position from our custom FEN string.
    config.PIECE_BITBOARDS = [0] * 12
    config.OCCUPANCIES = [0] * 3
    config.SIDE_TO_MOVE = "white"
    config.ENPASSANT_SQUARE = "no_square"
    config.CASTLING_RIGHT = 0
    config.REPETITION_INDEX = 0
    # Reset repetition table?
    config.REPETITON_TABLE = [0] * config.REPETITION_TABLE_SIZE

    FEN_to_list = FEN.split()
    if not (4 <= len(FEN_to_list) <= 6):
        # Check config.py for examples of a valid FEN string
        print("!!!!! INVALID FEN STRING !!!!!")
        print(FEN)
        return

    # Parse board position
    position = FEN_to_list[0]
    square = 0
    index = 0
    while square < 64:
        current_piece = position[index]

        if current_piece.isalpha() and current_piece in config.ASCII_PIECES:
            config.PIECE_BITBOARDS[config.Pieces[current_piece].value] = utils.set_bit(
                config.PIECE_BITBOARDS[config.Pieces[current_piece].value], square
            )
            index += 1
            square += 1

        elif current_piece.isdigit() and int(current_piece) in range(1, 9):
            square += int(current_piece)
            index += 1

        elif current_piece == "/":
            index += 1

        else:
            print(
                f"!!!!! INVALID FEN CHARACTER IN SQUARE REPRESENTATION: {current_piece} !!!!!"
            )
            print(FEN)
            return

    # Parse side to move
    stm = FEN_to_list[1].lower()
    if stm == "b":
        config.SIDE_TO_MOVE = "black"
    elif stm != "w":
        print(
            f"!!!!! INVALID FEN CHARACTER IN SIDE-TO-MOVE REPRESENTATION: {stm} !!!!!"
        )
        print(FEN)
        return

    # Parse castling rights
    castling_rights = FEN_to_list[2]
    if castling_rights != "-" and len(castling_rights) <= 4:
        for right in castling_rights:
            try:
                config.CASTLING_RIGHT |= config.Castling[right].value
            except KeyError:
                if right != "-":
                    print(
                        f"!!!!! INVALID FEN CHARACTER IN CASTLING-RIGHTS REPRESENTATION: {right} !!!!!"
                    )
                    print(FEN)
                    return
                continue
    elif len(castling_rights) > 4:
        print(
            f"!!!!! INVALID FEN STRING. CASTLING-RIGHTS REPRESENTATION SHOULD BE OF LENGTH AT MOST 4: {castling_rights} !!!!!"
        )
        print(FEN)
        return

    # Parse en passant square
    eps = FEN_to_list[3]
    if eps != "-" and len(eps) == 2:
        try:
            config.ENPASSANT_SQUARE = eps.lower()
        except KeyError:
            print(f"!!!!! INVALID EN PASSANT REPRESENTATION IN FEN STRING: {eps} !!!!!")
            print(FEN)
            return
    elif eps != "-" and len(eps) != 2:
        print(f"!!!!! INVALID EN PASSANT REPRESENTATION IN FEN STRING: {eps} !!!!!")
        print(FEN)
        return

    # Set occupancies for white and black pieces
    for i in range(6):
        config.OCCUPANCIES[0] |= config.PIECE_BITBOARDS[i]
        config.OCCUPANCIES[1] |= config.PIECE_BITBOARDS[i + 6]

    # Set occupancies for all pieces
    config.OCCUPANCIES[2] = config.OCCUPANCIES[0] | config.OCCUPANCIES[1]

    # Init hask keys
    config.HASH_KEY = utils.generate_hash_keys()


################################################
##                                            ##
##                Move parser                 ##
##                                            ##
################################################


def parse_move(move: str):
    """
    Given a move (likely from user input),
    parse it to see if it is legal.
    Should be compatible with UCI protocol.

    Move should be structured like the following:
        - First two positions indicate source
        - Next two indicate target
        - If promotion, next position should indicate
            piece promoted to.

        So,
            'e3f5' indicates a knight move from the 'e3'
        square to the 'f5' square;
            'h2h1q' indicates a pawn getting promoted to
            a queen.

    General idea:
        - Confirm that move has source, target
            and promotion (if exists).
        - Find which piece it is and see if move
            can be made. (Take advantage of side
            to move to narrow whose piece it is.)
    """

    # In case move is sent in upper case, convert it
    # to lower.
    move = move.strip().lower()

    # Move should be of length 4
    if not (4 <= len(move) <= 5):
        return

    # Get source and target squares from move
    try:
        source_index = config.BoardSquares[move[:2]].value
        target_index = config.BoardSquares[move[2:4]].value
    except (IndexError, KeyError):
        return

    # Get promoted piece if available
    promoted = None
    if len(move) == 5:
        promoted = move[4]
        if promoted not in ["q", "r", "n", "b"]:
            return

    # All fine. Now get the piece
    offset, own_colour_index, pawn_offset = (
        (0, 0, -8) if config.SIDE_TO_MOVE == "white" else (6, 1, 8)
    )
    piece = None
    for i in range(6):
        if get_bit(config.PIECE_BITBOARDS[i + offset], source_index):
            piece = config.ASCII_PIECES[i + offset]
            break

    if piece is None:
        # Most likely because trying to move opponent's piece; flag as invalid
        return

    # init flags for move encoding
    castling = 0
    capture = 0
    en_passant = 0
    double_pawn_push = 0
    moving_piece = config.Pieces[piece].value
    promoted_piece = 0

    illegal = False
    promo_map = {"n": 7, "b": 8, "q": 10, "r": 9}
    # promo_map = {'n': 1, 'b': 2, 'q': 4, 'r': 8}

    if piece.lower() == "p":
        probable_pawn_push = (
            config.PAWN_MOVES_MASKS[own_colour_index][source_index]
            & ~config.OCCUPANCIES[2]
        )
        probable_pawn_capture = get_bit(
            config.PAWN_ATTACKS[own_colour_index][source_index]
            & config.OCCUPANCIES[own_colour_index ^ 1],
            target_index,
        )
        probable_en_passant = (
            target_index == config.BoardSquares[config.ENPASSANT_SQUARE].value
        )

        if probable_pawn_push:
            if not probable_pawn_capture and not probable_en_passant:
                # If we're not making a capture, then anything invalid here
                # is invalid period; no checking anywhere else.
                if not (
                    1 - (1 & (config.OCCUPANCIES[2] >> (source_index + pawn_offset)))
                ) or not get_bit(probable_pawn_push, target_index):
                    # square just ahead of source square isn't empty ==> illegal move.
                    # target square not in the appropriate distance from source square
                    # for a pawn push ==> illegal move.
                    return
                if abs(target_index - source_index) == 16:
                    # We have a double pawn push
                    double_pawn_push = 1
                if target_index in range(8) or target_index in range(56, 64):
                    # We're promoting
                    if promoted is None:
                        # we should be promoting, but the piece we're promoting
                        # to wasn't specified ==> illegal move
                        return
                    promoted_piece = promo_map[promoted]
        if probable_pawn_capture:
            capture = 1
            # We check promotion in the case of captures as well as
            # regular pawn pushes
            if target_index in range(8) or target_index in range(56, 64):
                # We're promoting
                if promoted is None:
                    # we should be promoting, but the piece we're promoting
                    # to wasn't specified ==> illegal move
                    return
                promoted_piece = promo_map[promoted]
        if probable_en_passant:
            # It's an en passant capture
            en_passant = 1
            capture = 1

        elif (
            not probable_pawn_push
            and not probable_pawn_capture
            and not probable_en_passant
        ):
            # Pawn move should be in one of the three categories above.
            # Anything else is illegal
            return

    elif piece.lower() == "k":
        k, q, rank, opp = (
            ("K", "Q", 1, "black")
            if config.SIDE_TO_MOVE == "white"
            else ("k", "q", 8, "white")
        )
        cks, cqs = generate_castling_moves(k, q, rank, opp)

        if get_bit(config.KING_ATTACKS[source_index], target_index):
            # We have a regular king move
            if get_bit(config.OCCUPANCIES[own_colour_index], target_index):
                # Target square occupied by own piece
                illegal = True
            elif get_bit(config.OCCUPANCIES[own_colour_index ^ 1], target_index):
                capture = 1

        elif target_index == source_index + 2:
            if cks:
                castling = 1
            else:
                illegal = True

        elif target_index == source_index - 2:
            if cqs:
                castling = 1
            else:
                illegal = True

        else:
            illegal = True

    elif piece.lower() == "n":
        if get_bit(config.KNIGHT_ATTACKS[source_index], target_index):
            if get_bit(config.OCCUPANCIES[own_colour_index], target_index):
                # Target square occupied by own piece
                illegal = True
            elif get_bit(config.OCCUPANCIES[own_colour_index ^ 1], target_index):
                capture = 1

        else:
            illegal = True

    elif piece.lower() == "b":
        if get_bit(
            get_bishop_attacks(source_index, config.OCCUPANCIES[2]), target_index
        ):
            if get_bit(config.OCCUPANCIES[own_colour_index], target_index):
                # Target square occupied by own piece
                illegal = True
            elif get_bit(config.OCCUPANCIES[own_colour_index ^ 1], target_index):
                capture = 1

        else:
            illegal = True

    elif piece.lower() == "r":
        if get_bit(get_rook_attacks(source_index, config.OCCUPANCIES[2]), target_index):
            if get_bit(config.OCCUPANCIES[own_colour_index], target_index):
                # Target square occupied by own piece
                illegal = True
            elif get_bit(config.OCCUPANCIES[own_colour_index ^ 1], target_index):
                capture = 1

        else:
            illegal = True

    elif piece.lower() == "q":
        if get_bit(
            get_queen_attacks(source_index, config.OCCUPANCIES[2]), target_index
        ):
            if get_bit(config.OCCUPANCIES[own_colour_index], target_index):
                # Target square occupied by own piece
                illegal = True
            elif get_bit(config.OCCUPANCIES[own_colour_index ^ 1], target_index):
                capture = 1

        else:
            illegal = True

    # We had an illegal move (for whatever reason)
    if illegal:
        return

    # All good; get move encoding and return it
    move_encoding = encode_move(
        source_index,
        target_index,
        moving_piece,
        promoted_piece,
        capture,
        double_pawn_push,
        en_passant,
        castling,
    )
    return move_encoding


def parse_move_using_generate_moves(move: str):
    """
    ALMOST 40X SLOWER!!!

    Given a move (likely from user input),
    parse it to see if it is legal.
    Should be compatible with UCI protocol.

    Move should be structured like the following:
        - First two positions indicate source
        - Next two indicate target
        - If promotion, next position should indicate
            piece promoted to.

        So,
            'e3f5' indicates a knight move from the 'e3'
        square to the 'f5' square;
            'h2h1q' indicates a pawn getting promoted to
            a queen.

    General idea:
        - Generate moves
        - Check if given move is part of the moves generated.
    """
    move = move.strip().lower()

    # Move should be of length 4
    if not (4 <= len(move) <= 5):
        return

    # Get source and target squares from move
    try:
        source_index = config.BoardSquares[move[:2]].value
        target_index = config.BoardSquares[move[2:4]].value
    except (IndexError, KeyError):
        return

    # Get promoted piece if available
    promoted_from_string = None
    if len(move) == 5:
        promoted_from_string = move[4]
        if promoted_from_string not in ["q", "r", "n", "b"]:
            return

    offset_prom = 0 if config.SIDE_TO_MOVE == "white" else 6

    # Generate moves
    move_list = generate_moves()
    for move_ in move_list:
        if source_index == get_move_source(move_) and target_index == get_move_target(
            move_
        ):
            promoted = get_move_promoted_piece(move_)
            if promoted_from_string is not None:
                if (
                    config.ASCII_PIECES[(promoted % 5) + offset_prom].lower()
                    == promoted_from_string
                ):
                    return move_
            else:
                if not promoted:
                    return move_
                return
    return
