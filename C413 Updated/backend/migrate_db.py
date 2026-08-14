import sqlite3
import os

DB_PATH = "legal_app.db"

def migrate():
    if not os.path.exists(DB_PATH):
        print("Database not found, skipping migration.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE cases ADD COLUMN prediction_result TEXT")
        conn.commit()
        print("Successfully added 'prediction_result' column to 'cases' table.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("Column 'prediction_result' already exists.")
        else:
            print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
