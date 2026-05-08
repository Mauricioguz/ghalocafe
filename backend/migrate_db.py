import sqlite3

def add_columns():
    conn = sqlite3.connect('la_leonora.db')
    cursor = conn.cursor()

    try:
        cursor.execute("ALTER TABLE ingresos ADD COLUMN cultivo VARCHAR;")
        print("Column 'cultivo' added to 'ingresos' table.")
    except sqlite3.OperationalError as e:
        print(f"Ingresos: {e}")

    try:
        cursor.execute("ALTER TABLE egresos ADD COLUMN cultivo VARCHAR;")
        print("Column 'cultivo' added to 'egresos' table.")
    except sqlite3.OperationalError as e:
        print(f"Egresos: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_columns()
