import config
import utils

################################################
##                                            ##
##               Evaluation                   ##
##                                            ##
################################################


def evaluate():
    """
    Analyses the current position
    """
    # Init score
    score = 0

    # Get current piece bitboards
    piece_bitboards = [bboard for bboard in config.PIECE_BITBOARDS]

    # Loop over piece bitboards
    for idx, piece, bitboard in zip(range(12), config.ASCII_PIECES, piece_bitboards):
        while bitboard:
            square = utils.get_lsb_index(bitboard)
            score += config.MATERIAL_SCORES[idx]

            # Add positional piece score
            if piece.lower() != "q":
                # We haven't updated queen positional scores
                ps = get_positional_score(piece, idx, square)
                score += ps

            bitboard = utils.pop_bit(bitboard, square)

    if config.SIDE_TO_MOVE == "white":
        return score
    return -score


def get_positional_score(piece: str, piece_index: int, square: int):
    old_rank, file = divmod(square, 8)
    piece_index = piece_index % 6
    if piece.isupper():
        return config.POSITIONAL_PIECE_SCORES[piece_index][square]
    mirror_square = (8 * (7 - old_rank)) + file
    return -config.POSITIONAL_PIECE_SCORES[piece_index][mirror_square]


def sort_moves(move_list: list, ply=0):
    """
    Sorts the moves in a move list in descending order
    """
    move_scores = [0] * len(move_list)
    for idx, move in enumerate(move_list):
        move_scores[idx] = (score_move(move), move)
    move_scores.sort(key=lambda x: x[0], reverse=True)
    for i in range(len(move_list)):
        move_list[i] = move_scores[i][1]
    return move_list


def sort_moves_his_way(move_list: list):
    """
    Sorts the moves in a move list in descending order
    Tries to do it as is done in bbc
    """
    move_scores = [0] * len(move_list)
    for idx, move in enumerate(move_list):
        move_scores[idx] = score_move(move)

    for current_move in range(len(move_list)):
        for next_move in range(current_move + 1, len(move_list)):
            if move_scores[current_move] < move_scores[next_move]:
                move_scores[current_move], move_scores[next_move] = (
                    move_scores[next_move],
                    move_scores[current_move],
                )
                move_list[current_move], move_list[next_move] = (
                    move_list[next_move],
                    move_list[current_move],
                )
    return move_list


def score_move(move: int):
    # Score PV move
    if config.SCORE_PV:
        if move == config.PV_TABLE[0][config.PLY]:
            # Disable score_pv
            config.SCORE_PV = 0
            # Give it the highest score so it can be ranked higher and searched first
            return 20000
    # Score capture move
    if utils.get_move_capture(move):
        captured_piece = 0
        offset_cap = 6 if config.SIDE_TO_MOVE == "white" else 0
        for idx in range(6):
            if utils.get_bit(
                config.PIECE_BITBOARDS[idx + offset_cap], utils.get_move_target(move)
            ):
                captured_piece = idx + offset_cap
                break

        return (
            config.MVV_LVA_TABLE[utils.get_move_piece(move)][captured_piece] + 10000
        )  # Adding 10000 to ensure captures rank higher than quiet moves
    else:
        # Quiet moves:

        # Score first killer move
        if config.KILLER_MOVES[0][config.PLY] == move:
            return 9000

        # Score second killer move
        elif config.KILLER_MOVES[1][config.PLY] == move:
            return 8000

        return config.HISTORY_MOVES[utils.get_move_piece(move)][
            utils.get_move_target(move)
        ]


def enable_pv_scoring(move_list):
    # Disable PV following
    config.FOLLOW_PV = 0

    for move in move_list:
        if config.PV_TABLE[0][config.PLY] == move:
            # Enable PV scoring and following
            config.SCORE_PV = 1
            config.FOLLOW_PV = 1
            return


################################################
##                                            ##
##                Repetition                  ##
##                                            ##
################################################


def is_repetition():
    for index in range(config.REPETITION_INDEX):
        if config.HASH_KEY == config.REPETITON_TABLE[index]:
            return True
    return False


################################################
##                                            ##
##                Quiescence                  ##
##                                            ##
################################################


def quiescence_search(alpha: int, beta: int, move=None, ply=0):
    if not (config.LEAF_NODES % 2047):
        utils.commmunicate()

    # Increment nodes count
    config.LEAF_NODES += 1

    # current_ply = ply

    if config.PLY >= config.MAX_PLY:
        # Abort to avoid IndexError with arrays relying on MAX_PLY
        return evaluate()

    # Breaking conditions
    evaluation = evaluate()

    if evaluation > alpha:
        alpha = evaluation

        if evaluation >= beta:
            # The node/move has failed high
            return beta

    # Generate moves
    move_list = utils.generate_moves()

    move_list = sort_moves_his_way(move_list)
    # move_list = sort_moves(move_list)

    # Loop over moves in move list
    for move in move_list:
        # Preserve board state
        board_state = utils.copy_board_state_2()

        # Increment ply
        config.PLY += 1
        # Increment rep index and update rep table
        config.REPETITION_INDEX += 1
        config.REPETITON_TABLE[config.REPETITION_INDEX] = config.HASH_KEY

        # We want only legal moves made
        if not utils.make_move(move, True):
            config.PLY -= 1
            # Decrement rep index and update rep table
            config.REPETITION_INDEX -= 1
            # config.REPETITON_TABLE[config.REPETITION_INDEX] = 0
            continue

        # Score move
        score = -quiescence_search(-beta, -alpha, move)

        # legal_moves_count += 1

        # Decrement ply
        config.PLY -= 1
        # Decrement rep index and update rep table
        config.REPETITION_INDEX -= 1
        # config.REPETITON_TABLE[config.REPETITION_INDEX] = 0

        # Restore board state
        utils.restore_board_state_2(board_state)

        if config.UCI_STOPPED:
            return 0

        # Fail hard beta cutoff: we can't go outside alpha-beta bounds
        if score >= beta:
            # The node/move has failed high
            return beta

        alpha = max(alpha, score)
    return alpha


################################################
##                                            ##
##                 Negamax                    ##
##                                            ##
################################################


def negamax(alpha: int, beta: int, depth: int, move=None):
    # config.PV_LENGTH[config.PLY] = config.PLY

    # First define hash_flag (set to alpha)
    hash_flag = config.HASH_ALPHA_FLAG
    hash_key = config.HASH_KEY

    if config.PLY and is_repetition():
        # Return draw score
        return 0

    value = utils.read_hash_entry(alpha, beta, depth, config.PLY, hash_key)
    is_pv_node = (beta - alpha) > 1
    if not is_pv_node and config.PLY and value != config.HASH_ENTRY_NOT_FOUND:
        return value

    if not (config.LEAF_NODES % 2047):
        utils.commmunicate()

    # init found_pv flag
    found_pv = False

    config.PV_LENGTH[config.PLY] = config.PLY

    if depth <= 0:
        return quiescence_search(alpha, beta, move=move)

    if config.PLY >= config.MAX_PLY:
        # Abort to avoid IndexError with arrays relying on MAX_PLY
        return evaluate()

    # Increment nodes count
    config.LEAF_NODES += 1

    # legal moves counter
    legal_moves_count = 0

    # is king under check
    if config.SIDE_TO_MOVE == "white":
        king_under_check = utils.is_square_attacked(
            utils.get_lsb_index(config.PIECE_BITBOARDS[config.Pieces["K"].value]),
            "black",
        )
    else:
        king_under_check = utils.is_square_attacked(
            utils.get_lsb_index(config.PIECE_BITBOARDS[config.Pieces["k"].value]),
            "white",
        )

    ########### NEW!! GOT IT FROM CMK'S MATE_SCORE_IN_GUI #################
    if king_under_check:
        # Increase depth
        depth += 1

    # Null Move Pruning.
    if depth >= 3 and not king_under_check and config.PLY:
        # Copy board state
        brd_state = utils.copy_board_state_2()
        null_move_hash = config.HASH_KEY
        # Switch side to move so opponent gets a free move
        # without us doing anything
        config.SIDE_TO_MOVE = config.SIDES[
            config.Colours[config.SIDE_TO_MOVE].value ^ 1
        ]

        # We hash the side key
        config.HASH_KEY ^= config.SIDE_KEY
        # hash_key = config.HASH_KEY

        # Just like in make_move, we hash en passant square if available
        if config.ENPASSANT_SQUARE != "no_square":
            config.HASH_KEY ^= config.ENPASSANT_KEYS[
                config.BoardSquares[config.ENPASSANT_SQUARE].value
            ]

        # Set en passant square to empty
        config.ENPASSANT_SQUARE = "no_square"

        # Increment ply
        config.PLY += 1
        # Increment rep index and update rep table
        config.REPETITION_INDEX += 1
        config.REPETITON_TABLE[config.REPETITION_INDEX] = config.HASH_KEY

        # Do the pruning:
        # Set up so that we check for a beta cutoff immediately
        score = -negamax(-beta, -beta + 1, depth - 3, move)

        # Decrement ply
        config.PLY -= 1
        # Decrement rep index and update rep table
        config.REPETITION_INDEX -= 1
        # config.REPETITON_TABLE[config.REPETITION_INDEX] = 0

        # Restore board state
        utils.restore_board_state_2(brd_state)
        config.HASH_KEY = null_move_hash

        # Check current stopped
        if config.UCI_STOPPED:
            return 0

        if score >= beta:
            # Fail high; beta cutoff
            return beta

    # Generate moves
    move_list = utils.generate_moves()

    if config.FOLLOW_PV:
        enable_pv_scoring(move_list)

    move_list = sort_moves_his_way(move_list)
    # move_list = sort_moves(move_list)

    # Init number of moves searched
    moves_searched = 0

    # Loop over moves in move list
    for move in move_list:
        # Preserve board state
        board_state = utils.copy_board_state_2()

        # Increment ply
        config.PLY += 1
        # Increment rep index and update rep table
        config.REPETITION_INDEX += 1
        config.REPETITON_TABLE[config.REPETITION_INDEX] = config.HASH_KEY

        # We want only legal moves made
        if not utils.make_move(move):
            config.PLY -= 1
            # Decrement rep index and update rep table
            config.REPETITION_INDEX -= 1
            # config.REPETITON_TABLE[config.REPETITION_INDEX] = 0
            continue

        # Score move
        # score = -negamax(-beta, -alpha, depth - 1, ply, move)

        legal_moves_count += 1

        if moves_searched == 0:
            score = -negamax(-beta, -alpha, depth - 1, move)
        # Late Move Reduction (LMR)
        else:
            # Apply Late Move Reduction
            if (
                moves_searched >= config.FULL_DEPTH_MOVES
                and depth >= config.REDUCTION_LIMIT
                and not king_under_check  # Should it be ply here or depth? Probably check the article.
                and not utils.get_move_capture(move)
                and not utils.get_move_promoted_piece(move)
            ):
                # Search move with reduced depth
                score = -negamax(-alpha - 1, -alpha, depth - 2, move)
            else:
                # This move doesn't qualify for LMR, so we ensure that
                # full depth search is done instead (in the next step)
                score = alpha + 1

            # Apply Principal Variation Search (PVS)
            if score > alpha:
                # We found a good move (PV) and now we check to confirm that all other moves are bad
                score = -negamax(-alpha - 1, -alpha, depth - 1, move)

                # "We expect all other moves to come back with a fail low (score <= alpha).
                # The reason for this assumption is that we trust our move ordering.
                # But if that search comes back with a (score > alpha) then it failed high and is probably
                # a new best score. But only if it is also (score < beta), otherwise it is a real fail high.
                # If it is inside our window we re-search it now and give it a new chance.
                # Re-searches can be very fast especially when we use a transposition table.
                # Then the PVS assumption continues, probably with a new best move."
                # from Harald Luessen's comment on this video from Code Monkey King's BBC series
                # https://www.youtube.com/watch?v=Gs4Zk6aihyQ&list=PLmN0neTso3Jxh8ZIylk74JpwfiWNI76Cs&index=62
                if alpha < score < beta:
                    score = -negamax(-beta, -alpha, depth - 1, move)

        # Decrement ply
        config.PLY -= 1
        # Decrement rep index and update rep table
        config.REPETITION_INDEX -= 1
        # config.REPETITON_TABLE[config.REPETITION_INDEX] = 0

        # Restore board state
        utils.restore_board_state_2(board_state)

        if config.UCI_STOPPED:
            return 0

        # Increment count of moves searched so far
        moves_searched += 1

        if score > alpha:
            # Set hash flag to be exact
            hash_flag = config.HASH_EXACT_FLAG
            if not utils.get_move_capture(move):
                # Update history moves
                config.HISTORY_MOVES[utils.get_move_piece(move)][
                    utils.get_move_target(move)
                ] += depth
            alpha = score

            # Update found_pv flag
            found_pv = True

            # Update PV table
            config.PV_TABLE[config.PLY][config.PLY] = move
            # Update current ply line
            for next_ply in range(config.PLY + 1, config.PV_LENGTH[config.PLY + 1]):
                # Copy move from deeper ply into current line
                config.PV_TABLE[config.PLY][next_ply] = config.PV_TABLE[config.PLY + 1][
                    next_ply
                ]
            # Adjust PV length for current ply
            config.PV_LENGTH[config.PLY] = config.PV_LENGTH[config.PLY + 1]

            # Fail hard beta cutoff: we can't go outside alpha-beta bounds
            if score >= beta:
                # The node/move has failed high
                # Write to transposition
                utils.write_to_transposition_table(
                    beta, depth, config.HASH_BETA_FLAG, config.PLY, hash_key
                )
                if not utils.get_move_capture(move):
                    # Update killer moves as follows:
                    # first killer move is the new move we've just processed,
                    # while the second killer move is the previous first killer move
                    (
                        config.KILLER_MOVES[1][config.PLY],
                        config.KILLER_MOVES[0][config.PLY],
                    ) = (config.KILLER_MOVES[0][config.PLY], move)
                return beta

    if legal_moves_count == 0:
        if king_under_check:
            # return so called mating score
            # Ply is needed here so it can find the shortest
            # path to mate
            return -config.MATE_VALUE + config.PLY

        # return stalemate score
        return 0

    utils.write_to_transposition_table(alpha, depth, hash_flag, config.PLY, hash_key)
    # Here's a fail low
    return alpha
