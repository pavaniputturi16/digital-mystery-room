from flask import Flask, request, jsonify
from flask_cors import CORS

from database import (
    get_connection,
    initialize_database
)


# =====================================
# CREATE FLASK APP
# =====================================

app = Flask(__name__)

CORS(app)


# =====================================
# INITIALIZE DATABASE
# =====================================

initialize_database()


# =====================================
# CURRENT PUZZLE SET
# =====================================

current_puzzle = {

    "drawer": "",
    "sequence": "",
    "computer": "",
    "final": ""

}


# =====================================
# HOME API
# =====================================

@app.route("/")
def home():

    return jsonify({

        "success": True,

        "message":
        "Digital Mystery Room Backend",

        "status":
        "Backend is running"

    })


# =====================================
# CREATE PLAYER
# =====================================

@app.route("/api/player", methods=["POST"])
def create_player():

    data = request.get_json()

    name = data.get("name")


    if not name:

        return jsonify({

            "success": False,

            "message":
            "Player name is required"

        }), 400


    connection = get_connection()

    cursor = connection.cursor()


    cursor.execute(
        """
        INSERT INTO players (name)
        VALUES (?)
        """,
        (name,)
    )


    player_id = cursor.lastrowid

    connection.commit()

    connection.close()


    return jsonify({

        "success": True,

        "message":
        "Player created successfully",

        "player_id":
        player_id,

        "name":
        name

    })


# =====================================
# GET PLAYER
# =====================================

@app.route(
    "/api/player/<int:player_id>",
    methods=["GET"]
)
def get_player(player_id):

    connection = get_connection()

    cursor = connection.cursor()


    cursor.execute(
        """
        SELECT *
        FROM players
        WHERE id = ?
        """,
        (player_id,)
    )


    player = cursor.fetchone()

    connection.close()


    if player is None:

        return jsonify({

            "success": False,

            "message":
            "Player not found"

        }), 404


    return jsonify({

        "success": True,

        "player": {

            "id":
            player["id"],

            "name":
            player["name"],

            "created_at":
            player["created_at"]

        }

    })


# =====================================
# SET NEW PUZZLE
# =====================================

@app.route(
    "/api/puzzle/set",
    methods=["POST"]
)
def set_puzzle():

    data = request.get_json()


    current_puzzle["drawer"] = str(
        data.get("drawer", "")
    ).strip()

    current_puzzle["sequence"] = str(
        data.get("sequence", "")
    ).strip()

    current_puzzle["computer"] = str(
        data.get("computer", "")
    ).strip()

    current_puzzle["final"] = str(
        data.get("final", "")
    ).strip()


    # =================================
    # CHECK PUZZLE DATA
    # =================================

    if not all(current_puzzle.values()):

        return jsonify({

            "success": False,

            "message":
            "All puzzle values are required"

        }), 400


    # =================================
    # SHOW IN TERMINAL
    # =================================

    print("")
    print("=====================================")
    print("🎲 NEW PUZZLE SET RECEIVED")
    print("=====================================")

    print(
        "🔐 Drawer:",
        current_puzzle["drawer"]
    )

    print(
        "🔢 Sequence:",
        current_puzzle["sequence"]
    )

    print(
        "💻 Computer:",
        current_puzzle["computer"]
    )

    print(
        "🚪 Final:",
        current_puzzle["final"]
    )

    print("=====================================")
    print("")


    return jsonify({

        "success": True,

        "message":
        "New puzzle set saved successfully"

    })


# =====================================
# CHECK PUZZLE
# =====================================

@app.route(
    "/api/puzzle/check",
    methods=["POST"]
)
def check_puzzle():

    data = request.get_json()


    puzzle = data.get("puzzle")

    answer = str(
        data.get("answer", "")
    ).strip()


    if not puzzle or not answer:

        return jsonify({

            "success": False,

            "message":
            "Puzzle and answer are required"

        }), 400


    # =================================
    # CHECK PUZZLE EXISTS
    # =================================

    if puzzle not in current_puzzle:

        return jsonify({

            "success": False,

            "message":
            "Invalid puzzle"

        }), 400


    # =================================
    # CHECK PUZZLE INITIALIZED
    # =================================

    correct_answer = current_puzzle[puzzle]


    if not correct_answer:

        return jsonify({

            "success": False,

            "message":
            "Puzzle set not initialized"

        }), 400


    # =================================
    # COMPARE ANSWER
    # =================================

    if (
        answer.lower()
        ==
        correct_answer.lower()
    ):

        print(
            f"✅ Correct {puzzle} answer"
        )

        return jsonify({

            "success": True,

            "correct": True,

            "message":
            "Correct answer!"

        })


    print(
        f"❌ Wrong {puzzle} answer"
    )


    return jsonify({

        "success": True,

        "correct": False,

        "message":
        "Wrong answer!"

    })


# =====================================
# SAVE GAME RESULT
# =====================================

@app.route(
    "/api/game/save",
    methods=["POST"]
)
def save_game():

    data = request.get_json()


    player_id = data.get(
        "player_id"
    )

    time_remaining = data.get(
        "time_remaining",
        0
    )

    hints_used = data.get(
        "hints_used",
        0
    )

    wrong_attempts = data.get(
        "wrong_attempts",
        0
    )

    puzzles_solved = data.get(
        "puzzles_solved",
        0
    )

    completed = data.get(
        "completed",
        False
    )


    # =================================
    # SCORE CALCULATION
    # =================================

    score = (

        (time_remaining * 2)

        + (puzzles_solved * 100)

        - (hints_used * 50)

        - (wrong_attempts * 20)

    )


    if score < 0:

        score = 0


    # =================================
    # SAVE TO DATABASE
    # =================================

    connection = get_connection()

    cursor = connection.cursor()


    cursor.execute(
        """
        INSERT INTO game_results (

            player_id,

            time_remaining,

            hints_used,

            wrong_attempts,

            puzzles_solved,

            score,

            completed

        )

        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,

        (

            player_id,

            time_remaining,

            hints_used,

            wrong_attempts,

            puzzles_solved,

            score,

            int(completed)

        )
    )


    result_id = cursor.lastrowid


    connection.commit()

    connection.close()


    return jsonify({

        "success": True,

        "message":
        "Game result saved successfully",

        "result_id":
        result_id,

        "score":
        score

    })


# =====================================
# LEADERBOARD
# =====================================

@app.route(
    "/api/leaderboard",
    methods=["GET"]
)
def leaderboard():

    connection = get_connection()

    cursor = connection.cursor()


    cursor.execute(
        """
        SELECT

            players.name,

            game_results.score,

            game_results.time_remaining,

            game_results.puzzles_solved,

            game_results.hints_used,

            game_results.wrong_attempts

        FROM game_results

        JOIN players

        ON players.id =
        game_results.player_id

        WHERE game_results.completed = 1

        ORDER BY game_results.score DESC

        LIMIT 10
        """
    )


    results = cursor.fetchall()

    connection.close()


    leaderboard_data = []


    for row in results:

        leaderboard_data.append({

            "name":
            row["name"],

            "score":
            row["score"],

            "time_remaining":
            row["time_remaining"],

            "puzzles_solved":
            row["puzzles_solved"],

            "hints_used":
            row["hints_used"],

            "wrong_attempts":
            row["wrong_attempts"]

        })


    return jsonify({

        "success": True,

        "leaderboard":
        leaderboard_data

    })


# =====================================
# RUN SERVER
# =====================================

if __name__ == "__main__":

    app.run(

        host="127.0.0.1",

        port=5000,

        debug=True

    )