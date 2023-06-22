import config
from parsers import generate_FEN_from_board_state, parse_fen
from utils import (copy_board_state_2, generate_moves, get_move_capture,
                   get_move_castling, get_move_double_pawn_push,
                   get_move_en_passant, get_move_promoted_piece,
                   get_move_source, get_move_target, get_time_ms, make_move,
                   restore_board_state, restore_board_state_2)


def perft_driver(depth: int):
    """
    SLOWER!!!
    """
    if depth == 0:
        restore_board_state()
        config.LEAF_NODES += 1
        return

    move_list = generate_moves()
    board_state_FEN_string = generate_FEN_from_board_state()
    for move in move_list:
        if not move:
            break
        # copy_board_state()
        moving_fen = generate_FEN_from_board_state()
        if not make_move(move):
            # restore_board_state()
            continue
        config.ALL_CAPTURES += get_move_capture(move) >> 20
        config.ALL_EN_PASSANT += get_move_en_passant(move) >> 22
        config.ALL_DOUBLE_PAWN_PUSH += get_move_double_pawn_push(move) >> 21
        config.ALL_CASTLES += get_move_castling(move) >> 23
        perft_driver(depth - 1)
        # restore_board_state()
        parse_fen(moving_fen)
    parse_fen(board_state_FEN_string)


def perft_driver_with_copy_restore(depth: int):
    if depth == 0:
        restore_board_state()
        config.LEAF_NODES += 1
        return

    move_list = generate_moves()
    board_state = copy_board_state_2()
    for move in move_list:
        if not move:
            break
        move_board_state = copy_board_state_2()
        if not make_move(move):
            # restore_board_state()
            continue
        config.ALL_CAPTURES += get_move_capture(move) >> 20
        config.ALL_EN_PASSANT += get_move_en_passant(move) >> 22
        config.ALL_DOUBLE_PAWN_PUSH += get_move_double_pawn_push(move) >> 21
        config.ALL_CASTLES += get_move_castling(move) >> 23
        perft_driver_with_copy_restore(depth - 1)
        restore_board_state_2(move_board_state)

        # # for debugging purposes only
        # #
        # # build hash key for updated position after move is made
        # hash_from_move = generate_hash_keys()
        # if hash_from_move != config.HASH_KEY:
        #     print("\n\nfrom perft (after take back)")
        #     print(f"move: ", end='')
        #     print_move(move)
        #     print_board()
        #     print(f"hash should be: {hex(hash_from_move)}")
        #     input()

    # We don't seem to need to restore this
    restore_board_state_2(board_state)


def perft_test_with_copy_restore(depth: int):
    """
    4x faster than doing it with parse_FEN and
    generate_FEN_from_board_state!!
    """

    move_list = generate_moves()
    board_state = copy_board_state_2()
    start = get_time_ms()
    for move in move_list:
        if not move:
            break
        sp = config.SQUARES[get_move_source(move)]
        ep = config.SQUARES[get_move_target(move)]
        move_board_state = copy_board_state_2()
        if not make_move(move):
            # restore_board_state()
            continue
        cummulative_nodes = config.LEAF_NODES

        perft_driver_with_copy_restore(depth - 1)
        old_nodes = config.LEAF_NODES - cummulative_nodes
        promoted_piece = get_move_promoted_piece(move)
        promoted_piece_str = " "
        if promoted_piece:
            promoted_piece_str = config.ASCII_PIECES[promoted_piece].lower()
        print(f"        move: {sp}{ep}{promoted_piece_str}  nodes: {old_nodes}")
        # print_move(move)
        restore_board_state_2(move_board_state)
    restore_board_state_2(board_state)

    ttaken = int(get_time_ms() - start)
    tt_in_sec = ttaken / 1000
    print()
    print(f"        Depth: {depth}")
    print(f"        Nodes: {config.LEAF_NODES}")
    print(f"        Time: {int(get_time_ms() - start)} ms")
    print(f"        Nodes / second: {config.LEAF_NODES / tt_in_sec:.0f}")


def perft_test(depth: int):
    move_list = generate_moves()
    board_state_FEN_string = generate_FEN_from_board_state()
    start = get_time_ms()
    for move in move_list:
        if not move:
            break
        sp = config.SQUARES[get_move_source(move)]
        ep = config.SQUARES[get_move_target(move)]
        moving_fen = generate_FEN_from_board_state()
        if not make_move(move):
            continue
        cummulative_nodes = config.LEAF_NODES

        perft_driver(depth - 1)
        old_nodes = config.LEAF_NODES - cummulative_nodes
        promoted_piece = get_move_promoted_piece(move)
        promoted_piece_str = " "
        if promoted_piece:
            promoted_piece_str = config.ASCII_PIECES[promoted_piece].lower()
        print(f"        move: {sp}{ep}{promoted_piece_str}  nodes: {old_nodes}")
        parse_fen(moving_fen)
    parse_fen(board_state_FEN_string)
    ttaken = int(get_time_ms() - start)
    tt_in_sec = ttaken / 1000
    print()
    print(f"        Depth: {depth}")
    print(f"        Nodes: {config.LEAF_NODES}")
    print(f"        Time: {int(get_time_ms() - start)} ms")
    print(f"        Nodes / second: {config.LEAF_NODES / tt_in_sec:.0f}")
