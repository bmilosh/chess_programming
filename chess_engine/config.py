from enum import Enum

################################################
##                                            ##
##           FEN debug positions              ##
##                                            ##
################################################

EMPTY_BOARD = "8/8/8/8/8/8/8/8 b - - 0 1 "
START_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 "
TRICKY_POSITION = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1 "
KILLER_POSITION = "rnbqkb1r/pp1p1pPp/8/2p1pP2/1P1P4/3P3P/P1P1P3/RNBQKBNR w KQkq e6 0 1"
CMK_POSITION = "r2q1rk1/ppp2ppp/2n1bn2/2b1p3/3pP3/3P1NPP/PPP1NPB1/R1BQ1RK1 b - - 0 9 "
OTHER_KILLER_POSITION = "6k1/3q1pp1/pp5p/1r5n/8/1P3PP1/PQ4BP/2R3K1 w - - 0 1"
REPETITION_POSITION = "2r3k1/R7/8/1R6/8/8/P4KPP/8 w - - 0 40 "

MAX_PLY = 64

MAX_DEPTH = 32
# FULL_DEPTH_MOVES = 5
FULL_DEPTH_MOVES = 4
# REDUCTION_LIMIT = 5
REDUCTION_LIMIT = 3

################################################
##                                            ##
##              Zobrist Hashing               ##
##                                            ##
################################################

# Some random hash keys we'll be needing are the following:
# Indexed by piece and then square
PIECE_KEYS = [[0 for _ in range(64)] for _ in range(12)]

# one for each square
ENPASSANT_KEYS = [0 for _ in range(64)]

# Castling keys
CASTLING_KEYS = [0 for _ in range(16)]

# Side key. We're keeping a key only for black
SIDE_KEY = 0
HASH_KEY = 0

# # Final hash key?
# PREV_UPDATED_HASH = 0
# PREV_HASH_FROM_MOVE = 0
# PREV_MOVE = ''

################################################
##                                            ##
##           Transposition Table              ##
##                                            ##
################################################

# Flags:
HASH_ALPHA_FLAG = 1
HASH_BETA_FLAG = 2
HASH_EXACT_FLAG = 0
HASH_ENTRY_NOT_FOUND = 200000

# Hash table size
HASH_TABLE_SIZE = 0x400000

# Table. Has the following structure
# {node/position: {hash_key: value, depth: value, hash_flag: flag, node_score: score}}
# TRANSPOSITION_TABLE[HASH_KEY % HASH_TABLE_SIZE] = {hash_key: key, depth: depth, hash_flag: flag, node_score: score}
TRANSPOSITION_TABLE = [0] * HASH_TABLE_SIZE
# TRANSPOSITION_TABLE = {}


################################################
##                                            ##
##             Repetition Table               ##
##                                            ##
################################################

REPETITION_TABLE_SIZE = 1000
REPETITON_TABLE = [0] * REPETITION_TABLE_SIZE
REPETITION_INDEX = 0

# REPETITION_INDEX += 1
# REPETITON_TABLE[REPETITION_INDEX] = HASH_KEY

"""
    =======================
         Move ordering
    =======================
    
    1. PV move
    2. Captures in MVV/LVA
    3. 1st killer move
    4. 2nd killer move
    5. History moves
    6. Unsorted moves
"""

"""
most valuable victim & less valuable attacker
                          
    (Victims) Pawn Knight Bishop   Rook  Queen   King
  (Attackers)
        Pawn   105    205    305    405    505    605
      Knight   104    204    304    404    504    604
      Bishop   103    203    303    403    503    603
        Rook   102    202    302    402    502    602
       Queen   101    201    301    401    501    601
        King   100    200    300    400    500    600
"""

# Access as MVV_LVA_TABLE[attacker_piece_index][victim_piece_index]
MVV_LVA_TABLE = [
    [105, 205, 305, 405, 505, 605,  105, 205, 305, 405, 505, 605],
	[104, 204, 304, 404, 504, 604,  104, 204, 304, 404, 504, 604],
	[103, 203, 303, 403, 503, 603,  103, 203, 303, 403, 503, 603],
	[102, 202, 302, 402, 502, 602,  102, 202, 302, 402, 502, 602],
	[101, 201, 301, 401, 501, 601,  101, 201, 301, 401, 501, 601],
	[100, 200, 300, 400, 500, 600,  100, 200, 300, 400, 500, 600],

	[105, 205, 305, 405, 505, 605,  105, 205, 305, 405, 505, 605],
	[104, 204, 304, 404, 504, 604,  104, 204, 304, 404, 504, 604],
	[103, 203, 303, 403, 503, 603,  103, 203, 303, 403, 503, 603],
	[102, 202, 302, 402, 502, 602,  102, 202, 302, 402, 502, 602],
	[101, 201, 301, 401, 501, 601,  101, 201, 301, 401, 501, 601],
	[100, 200, 300, 400, 500, 600,  100, 200, 300, 400, 500, 600]
]

# Accessed as KILLER_MOVES[id (not more than 2)][ply (we chose a max of 64 plies)]
KILLER_MOVES = [[0 for _ in range(MAX_PLY)] for _ in range(2)]

# Accessed as KILLER_MOVES[piece_index][square]
HISTORY_MOVES = [[0 for _ in range(64)] for _ in range(12)]


################################################
##                                            ##
##           Principal variation              ##
##                                            ##
################################################

"""
      ================================
            Triangular PV table
      --------------------------------
        PV line: e2e4 e7e5 g1f3 b8c6
      ================================

           0    1    2    3    4    5
      
      0    m1   m2   m3   m4   m5   m6
      
      1    0    m2   m3   m4   m5   m6 
      
      2    0    0    m3   m4   m5   m6
      
      3    0    0    0    m4   m5   m6
       
      4    0    0    0    0    m5   m6
      
      5    0    0    0    0    0    m6
"""

FOLLOW_PV = 0

SCORE_PV = 0

PV_LENGTH = [0 for _ in range(MAX_PLY)]
"""
Indexed by plies
"""

PV_TABLE = [[0 for _ in range(MAX_PLY)] for _ in range(MAX_PLY)]

# Score layout:
#       [-infinity, -mate_value, ... , -mate_score, ... , non-mating score, ... , mate_score, ... , mate_value, infinity]
INFINITY = 50000
MATE_VALUE = 49000
MATE_SCORE = 48000


################################################
##                                            ##
##         UCI Time Control Variables         ##
##                                            ##
################################################

# exit from engine flag
UCI_QUIT = 0

# UCI "movestogo" command moves counter
UCI_MOVES_TO_GO = 30

# UCI "movetime" command time counter
UCI_MOVE_TIME = -1

# UCI "time" command holder (ms)
UCI_TIME = -1

# UCI "inc" command's time increment holder
UCI_INCREMENT_TIME = 0

# UCI "starttime" command time holder
UCI_START_TIME = 0

# UCI "stoptime" command time holder
UCI_STOP_TIME = 0

# variable to flag time control availability
UCI_TIME_IS_SET = False

# variable to flag when the time is up
UCI_STOPPED = 0

################################################
##                                            ##
##             Material scores                ##
##                                            ##
################################################

"""

    ♙ =   100   = ♙
    ♘ =   300   = ♙ * 3
    ♗ =   350   = ♙ * 3 + ♙ * 0.5
    ♖ =   500   = ♙ * 5
    ♕ =   1000  = ♙ * 10
    ♔ =   10000 = ♙ * 100
"""

# Ordered as in pieces: ["P", "N", "B", "R", "Q", "K", "p", "n", "b", "r", "q", "k"]
MATERIAL_SCORES = [100, 300, 350, 500, 1_000, 10_000, -100, -300, -350, -500, -1_000, -10_000]


################################################
##                                            ##
##             Positional scores              ##
##                                            ##
################################################


PAWN_POSITIONAL_SCORES = [
    90,  90,  90,  90,  90,  90,  90,  90,
    30,  30,  30,  40,  40,  30,  30,  30,
    20,  20,  20,  30,  30,  30,  20,  20,
    10,  10,  10,  20,  20,  10,  10,  10,
     5,   5,  10,  20,  20,   5,   5,   5,
     0,   0,   0,   5,   5,   0,   0,   0,
     0,   0,   0, -10, -10,   0,   0,   0,
     0,   0,   0,   0,   0,   0,   0,   0
]

KNIGHT_POSITIONAL_SCORES = [
    -5,   0,   0,   0,   0,   0,   0,  -5,
    -5,   0,   0,  10,  10,   0,   0,  -5,
    -5,   5,  20,  20,  20,  20,   5,  -5,
    -5,  10,  20,  30,  30,  20,  10,  -5,
    -5,  10,  20,  30,  30,  20,  10,  -5,
    -5,   5,  20,  10,  10,  20,   5,  -5,
    -5,   0,   0,   0,   0,   0,   0,  -5,
    -5, -10,   0,   0,   0,   0, -10,  -5
]

BISHOP_POSITIONAL_SCORES = [
    0,   0,   0,   0,   0,   0,   0,   0,
     0,   0,   0,   0,   0,   0,   0,   0,
     0,   0,   0,  10,  10,   0,   0,   0,
     0,   0,  10,  20,  20,  10,   0,   0,
     0,   0,  10,  20,  20,  10,   0,   0,
     0,  10,   0,   0,   0,   0,  10,   0,
     0,  30,   0,   0,   0,   0,  30,   0,
     0,   0, -10,   0,   0, -10,   0,   0
]

ROOK_POSITIONAL_SCORES = [
    50,  50,  50,  50,  50,  50,  50,  50,
    50,  50,  50,  50,  50,  50,  50,  50,
     0,   0,  10,  20,  20,  10,   0,   0,
     0,   0,  10,  20,  20,  10,   0,   0,
     0,   0,  10,  20,  20,  10,   0,   0,
     0,   0,  10,  20,  20,  10,   0,   0,
     0,   0,  10,  20,  20,  10,   0,   0,
     0,   0,   0,  20,  20,   0,   0,   0
]

KING_POSITIONAL_SCORES = [
    0,   0,   0,   0,   0,   0,   0,   0,
     0,   0,   5,   5,   5,   5,   0,   0,
     0,   5,   5,  10,  10,   5,   5,   0,
     0,   5,  10,  20,  20,  10,   5,   0,
     0,   5,  10,  20,  20,  10,   5,   0,
     0,   0,   5,  10,  10,   5,   0,   0,
     0,   5,   5,  -5,  -5,   0,   5,   0,
     0,   0,   5,   0, -15,   0,  10,   0
]

MIRROR_POSITIONAL_SCORES = [
    "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
	"a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
	"a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
	"a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
	"a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
	"a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
	"a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
	"a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"
]

POSITIONAL_PIECE_SCORES = [
    PAWN_POSITIONAL_SCORES,
    KNIGHT_POSITIONAL_SCORES,
    BISHOP_POSITIONAL_SCORES,
    ROOK_POSITIONAL_SCORES,
    [],
    KING_POSITIONAL_SCORES,
]

################################################
##                                            ##
##              Move Encoding                 ##
##                                            ##
################################################


"""
          binary move bits                               hexadecimal constants
    
    0000 0000 0000 0000 0011 1111    source square       0x3f
    0000 0000 0000 1111 1100 0000    target square       0xfc0
    0000 0000 1111 0000 0000 0000    piece               0xf000
    0000 1111 0000 0000 0000 0000    promoted piece      0xf0000
    0001 0000 0000 0000 0000 0000    capture flag        0x100000
    0010 0000 0000 0000 0000 0000    double push flag    0x200000
    0100 0000 0000 0000 0000 0000    enpassant flag      0x400000
    1000 0000 0000 0000 0000 0000    castling flag       0x800000
"""


SOURCE_SQUARE_MASK = 0x3f
TARGET_SQUARE_MASK = 0xfc0
MOVING_PIECE_MASK = 0xf000
PROMOTED_PIECE_MASK = 0xf0000
CAPTURE_MASK = 0x100000
DOUBLE_PAWN_PUSH_MASK = 0x200000
EN_PASSANT_MASK = 0x400000
CASTLING_MASK = 0x800000

MOVE_LIST = [0] * 256
MOVE_COUNT = 0

# Half-move counter
PLY = 0

BEST_MOVE = 0


################################################
##                                            ##
##                  Enums                     ##
##                                            ##
################################################


SQUARES = [
    'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
    'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
    'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
    'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
    'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
    'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
    'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'no_square',
]


BoardSquares = Enum(
    "Square",
    SQUARES,
    start=0,
)

# ASCII_PIECES = "PNBRQKpnbrqk"
ASCII_PIECES = ["P", "N", "B", "R", "Q", "K", "p", "n", "b", "r", "q", "k"]

Pieces = Enum("Pieces", ASCII_PIECES, start=0)

UNICODE_PIECES = ["♟︎", "♞", "♝", "♜", "♛", "♚", "♙", "♘", "♗", "♖", "♕", "♔"]

SIDES = ["white", "black"]

Colours = Enum("Colour", SIDES, start=0)

# Castling = Enum("Castling", ["K", "Q", "k", "q"])

class Castling(Enum):
    q = 1
    k = 2
    Q = 4
    K = 8

# Enpassant square
ENPASSANT_SQUARE = 'no_square'

# This predefined table helps with updating
# castling right after every move.
# Movement on squares other than kings' and
# rooks' opening squares do not affect castling right
# which is set at 15 for full rights for both sides.
# However, movements on kings' and/or rooks' opening
# squares, whether it's a source or target square,
# changes castling rights.
CASTLING_RIGHT_LOOKUP_TABLE = [
    14, 15, 15, 15, 12, 15, 15, 13,
    15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15,
    11, 15, 15, 15,  3, 15, 15, 7,
]


################################################
##                                            ##
##                Constants                   ##
##                                            ##
################################################


# Integer representation of the bitboards above
NOT_FILE_A = 18374403900871474942
NOT_FILE_AB = 18229723555195321596
NOT_FILE_H = 9187201950435737471
NOT_FILE_HG = 4557430888798830399

# Piece bitboards
PIECE_BITBOARDS = [
    int('0b11111111', 2) << 48,
    int('0b01000010', 2) << 56,
    int('0b100100', 2) << 56,
    int('0b10000001', 2) << 56,
    int('0b1000', 2) << 56,
    int('0b10000', 2) << 56,
    int('0b11111111', 2) << 8,
    int('0b01000010', 2),
    int('0b100100', 2),
    int('0b10000001', 2),
    int('0b1000', 2),
    int('0b10000', 2),
]

# Occupancy bitboards: [WHITE, BLACK, BOTH]
OCCUPANCIES = [18446462598732840960, 65535, 18446462598732906495]

# Side to move
SIDE_TO_MOVE = "white"

# Board state copies
PIECE_BITBOARDS_COPY = [num for num in PIECE_BITBOARDS]
OCCUPANCIES_COPY = [18446462598732840960, 65535, 18446462598732906495]
SIDE_TO_MOVE_COPY = "white"
CASTLING_RIGHT_COPY = 0
ENPASSANT_SQUARE_COPY = 'no_square'
MOVE_LIST_COPY = [0] * 256
MOVE_COUNT_COPY = 0


"""
Castling representations
    bin    dec
    
   0001    1  black king can castle to the queen side 
   0010    2  black king can castle to the king side 
   0100    4  white king can castle to the queen side
   1000    8  white king can castle to the king side

   examples
   1111    17  both sides can castle both directions
   
   1001       black king => queen side
              white king => king side
"""
# Castling rights
CASTLING_RIGHT = 0

# This lookup table holds bitboards corresponding to attack
# squares of pawns. We structure it as a list of lists.
# First list is for white pawns and second is for black.
PAWN_ATTACKS = [[0] * 64, [0] * 64]
PAWN_MOVES_MASKS = [[0] * 64, [0] * 64]

KNIGHT_ATTACKS = [0] * 64
# KNIGHT_OFFSETS = [15, 17, 6, 10]

KING_ATTACKS = [0] * 64
# KING_OFFSETS = [1, 7, 8, 9]

# Sliding pieces attack masks 
BISHOP_MASKS = [0] * 64
ROOK_MASKS = [0] * 64

# Sliding pieces attacks tables
# For each square, we have all the possible occupancy
# combinations available to the square
BISHOP_ATTACKS = [[0] * 512 for _ in range(64)]
ROOK_ATTACKS = [[0] * 4096 for _ in range(64)]

BISHOP_RELEVANCY_OCC_COUNT = [
    6, 5, 5, 5, 5, 5, 5, 6, 
    5, 5, 5, 5, 5, 5, 5, 5,
    5, 5, 7, 7, 7, 7, 5, 5,
    5, 5, 7, 9, 9, 7, 5, 5,
    5, 5, 7, 9, 9, 7, 5, 5,
    5, 5, 7, 7, 7, 7, 5, 5,
    5, 5, 5, 5, 5, 5, 5, 5,
    6, 5, 5, 5, 5, 5, 5, 6,
]

ROOK_RELEVANCY_OCC_COUNT = [
    12, 11, 11, 11, 11, 11, 11, 12, 
    11, 10, 10, 10, 10, 10, 10, 11,
    11, 10, 10, 10, 10, 10, 10, 11,
    11, 10, 10, 10, 10, 10, 10, 11,
    11, 10, 10, 10, 10, 10, 10, 11,
    11, 10, 10, 10, 10, 10, 10, 11,
    11, 10, 10, 10, 10, 10, 10, 11,
    12, 11, 11, 11, 11, 11, 11, 12,
]

ROOK_MAGIC_NUMBERS = [
    0x8a80104000800020,
    0x140002000100040,
    0x2801880a0017001,
    0x100081001000420,
    0x200020010080420,
    0x3001c0002010008,
    0x8480008002000100,
    0x2080088004402900,
    0x800098204000,
    0x2024401000200040,
    0x100802000801000,
    0x120800800801000,
    0x208808088000400,
    0x2802200800400,
    0x2200800100020080,
    0x801000060821100,
    0x80044006422000,
    0x100808020004000,
    0x12108a0010204200,
    0x140848010000802,
    0x481828014002800,
    0x8094004002004100,
    0x4010040010010802,
    0x20008806104,
    0x100400080208000,
    0x2040002120081000,
    0x21200680100081,
    0x20100080080080,
    0x2000a00200410,
    0x20080800400,
    0x80088400100102,
    0x80004600042881,
    0x4040008040800020,
    0x440003000200801,
    0x4200011004500,
    0x188020010100100,
    0x14800401802800,
    0x2080040080800200,
    0x124080204001001,
    0x200046502000484,
    0x480400080088020,
    0x1000422010034000,
    0x30200100110040,
    0x100021010009,
    0x2002080100110004,
    0x202008004008002,
    0x20020004010100,
    0x2048440040820001,
    0x101002200408200,
    0x40802000401080,
    0x4008142004410100,
    0x2060820c0120200,
    0x1001004080100,
    0x20c020080040080,
    0x2935610830022400,
    0x44440041009200,
    0x280001040802101,
    0x2100190040002085,
    0x80c0084100102001,
    0x4024081001000421,
    0x20030a0244872,
    0x12001008414402,
    0x2006104900a0804,
    0x1004081002402,
]

BISHOP_MAGIC_NUMBERS = [
    0x40040844404084,
    0x2004208a004208,
    0x10190041080202,
    0x108060845042010,
    0x581104180800210,
    0x2112080446200010,
    0x1080820820060210,
    0x3c0808410220200,
    0x4050404440404,
    0x21001420088,
    0x24d0080801082102,
    0x1020a0a020400,
    0x40308200402,
    0x4011002100800,
    0x401484104104005,
    0x801010402020200,
    0x400210c3880100,
    0x404022024108200,
    0x810018200204102,
    0x4002801a02003,
    0x85040820080400,
    0x810102c808880400,
    0xe900410884800,
    0x8002020480840102,
    0x220200865090201,
    0x2010100a02021202,
    0x152048408022401,
    0x20080002081110,
    0x4001001021004000,
    0x800040400a011002,
    0xe4004081011002,
    0x1c004001012080,
    0x8004200962a00220,
    0x8422100208500202,
    0x2000402200300c08,
    0x8646020080080080,
    0x80020a0200100808,
    0x2010004880111000,
    0x623000a080011400,
    0x42008c0340209202,
    0x209188240001000,
    0x400408a884001800,
    0x110400a6080400,
    0x1840060a44020800,
    0x90080104000041,
    0x201011000808101,
    0x1a2208080504f080,
    0x8012020600211212,
    0x500861011240000,
    0x180806108200800,
    0x4000020e01040044,
    0x300000261044000a,
    0x802241102020002,
    0x20906061210001,
    0x5a84841004010310,
    0x4010801011c04,
    0xa010109502200,
    0x4a02012000,
    0x500201010098b028,
    0x8040002811040900,
    0x28000010020204,
    0x6000020202d0240,
    0x8918844842082200,
    0x4010011029020020,
]

PSEUDORANDOM_NUMBER_STATE = 1804289383

LEAF_NODES = 0

# For testing purposes
ALL_CAPTURES = 0
ALL_EN_PASSANT = 0
ALL_CASTLES = 0
ALL_DOUBLE_PAWN_PUSH = 0
ORIGINAL_MOVE_LIST = []
ORIGINAL_DEPTH = 90000