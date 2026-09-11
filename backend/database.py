import sqlite3


DATABASE = "mystery_room.db"


def get_connection():

    connection = sqlite3.connect(DATABASE)

    connection.row_factory = sqlite3.Row

    return connection


def initialize_database():

    connection = get_connection()

    cursor = connection.cursor()


    # Players table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS players (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            created_at TIMESTAMP
            DEFAULT CURRENT_TIMESTAMP

        )
    """)


    # Game results table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS game_results (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            player_id INTEGER,

            time_remaining INTEGER DEFAULT 0,

            hints_used INTEGER DEFAULT 0,

            wrong_attempts INTEGER DEFAULT 0,

            puzzles_solved INTEGER DEFAULT 0,

            score INTEGER DEFAULT 0,

            completed INTEGER DEFAULT 0,

            created_at TIMESTAMP
            DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (player_id)
            REFERENCES players(id)

        )
    """)


    connection.commit()

    connection.close()