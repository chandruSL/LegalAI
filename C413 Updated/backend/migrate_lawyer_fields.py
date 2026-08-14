import sqlite3
import os
import random

DB_PATH = "legal_app.db"

def migrate_and_seed():
    if not os.path.exists(DB_PATH):
        print("Database not found, skipping.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Add Columns
    columns = [
        ("hourly_fee", "INTEGER"),
        ("specialization", "TEXT"),
        ("rating", "FLOAT"),
        ("success_rate", "INTEGER")
    ]
    
    for col_name, col_type in columns:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print(f"Column {col_name} already exists")
            else:
                print(f"Error adding {col_name}: {e}")

    conn.commit()
    
    # 2. Populate Dummy Data for Lawyers
    # We identify lawyers by role='lawyer' (Note: role is stored as string "lawyer" in DB)
    specializations = ["Criminal Law", "Family Law", "Corporate Law", "Property Law", "Civil Litigation"]
    
    cursor.execute("SELECT id FROM users WHERE role='lawyer'")
    lawyers = cursor.fetchall()
    
    for (lawyer_id,) in lawyers:
        fee = random.randint(2000, 10000)
        spec = random.choice(specializations)
        rate = round(random.uniform(3.5, 5.0), 1)
        success = random.randint(70, 99)
        
        cursor.execute("""
            UPDATE users 
            SET hourly_fee=?, specialization=?, rating=?, success_rate=?
            WHERE id=?
        """, (fee, spec, rate, success, lawyer_id))
        print(f"Updated Lawyer ID {lawyer_id}: {spec}, ${fee}, {rate}*, {success}%")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate_and_seed()
