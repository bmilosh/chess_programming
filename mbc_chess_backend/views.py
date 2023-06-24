import json
import logging
import os
import stat
import sys

import chess
import chess.engine
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Enable debug logging.
logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)

# # engine = chess.engine.SimpleEngine
# engine = None

if sys.platform == "linux":
    # PyInstaller seems to need `write` permissions in addition to
    # `read` and `execute` when we're in Heroku. So here we go.
    os.chmod('./chess_engine/dist/MBC/MBC', stat.S_IRWXU | stat.S_IRWXG | stat.S_IRWXO)
    PATH_TO_ENGINE = './chess_engine/dist/MBC/MBC'
    # os.chmod('./chess_engine/dist/MBC/MBC', stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
else:
    PATH_TO_ENGINE = './chess_engine/dist1/MBC/MBC.exe'

# python3 manage.py runserver 8080
@api_view(["POST"])
def make_move(request):
    # if engine is None:
    #     return Response(json.dumps({"message": "Engine not running. Cannot make move."}))
    body = json.loads(request.body)
    # Extract relevant info from body
    fen = body["fen"]
    limit = body["searchTimeLimit"]

    board = chess.Board(fen=fen)
    # result = engine.play(board, chess.engine.Limit(time=float(limit)))
    # best_move = result.move
    with chess.engine.SimpleEngine.popen_uci(PATH_TO_ENGINE) as engine:
        result = engine.analyse(board, chess.engine.Limit(time=float(limit)))
    # result = engine.analyse(board, chess.engine.Limit(time=float(limit)))
    best_move = result["pv"][0]
    body["san"] = board.san(best_move)
    body["best_move"] = board.lan(best_move)
    body["square_from"] = chess.SQUARE_NAMES[best_move.from_square]
    body["square_to"] = chess.SQUARE_NAMES[best_move.to_square]

    # update internal python chess board state
    board.push(best_move)
    
    # extract FEN from current board state
    fen = board.fen()

    body["fen"] = fen
    body["full_move"] = best_move

    tojson = json.dumps(body, default=vars)

    return Response(tojson)


@api_view(["GET"])
def kill_engine(request):
    # # print("Kill engine called")
    # try:
    #     engine.quit()
    #     engine.close()
    # # except chess.engine.EngineTerminatedError:
    # except:
    #     return Response(json.dumps({"message": "Engine already killed"}))
    return Response(json.dumps({"message": "Engine successfully killed"}))


@api_view(['GET'])
def start_engine(request):
    # global engine
    # if sys.platform == "linux":
    #     # PyInstaller seems to need `write` permissions in addition to
    #     # `read` and `execute` when we're in Heroku. So here we go.
    #     os.chmod('./chess_engine/dist/MBC/MBC', stat.S_IRWXU | stat.S_IRWXG | stat.S_IRWXO)
    #     # os.chmod('./chess_engine/dist/MBC/MBC', stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    #     statinfo = os.stat('./chess_engine/dist/MBC/MBC')
    #     # print(statinfo)
    #     engine = chess.engine.SimpleEngine.popen_uci('./chess_engine/dist/MBC/MBC')
    # else:
    #     engine = chess.engine.SimpleEngine.popen_uci('./chess_engine/dist1/MBC/MBC.exe')
    # engine = chess.engine.SimpleEngine.popen_uci('./chess_engine/dist1/MBC/MBC.exe')
    return Response(json.dumps({"message": "Engine started successfully"}))
