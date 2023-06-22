import json

import chess
import chess.engine
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# engine = chess.engine.SimpleEngine.popen_uci('./dist/MBC/MBC.exe')
engine = chess.engine.SimpleEngine

@api_view(["POST"])
def make_move(request):
    body = json.loads(request.body)
    # Extract relevant info from body
    fen = body["fen"]
    limit = body["searchTimeLimit"]

    board = chess.Board(fen=fen)
    # print(request.__dir__())
    # limit = request.GET.get("searchTimeLimit", "")
    # print(f"{limit = }")
    result = engine.play(board, chess.engine.Limit(time=float(limit)))
    # try:
    #     result = engine.play(board, chess.engine.Limit(time=float(limit)))
    # except:
    #     limit = request.POST.get("searchTimeLimit", "")
    #     result = engine.play(board, chess.engine.Limit(time=float(limit)))
    best_move = result.move
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
    # print("Kill engine called")
    try:
        engine.quit()
    except chess.engine.EngineTerminatedError:
        return Response(json.dumps({"message": "Engine already killed"}))
    return Response(json.dumps({"message": "Engine successfully killed"}))


@api_view(['GET'])
def start_engine(request):
    # print("Start engine called")
    global engine
    engine = chess.engine.SimpleEngine.popen_uci('./chess_engine/dist/MBC/MBC.exe')
    return Response(json.dumps({"message": "Engine started successfully"}))
