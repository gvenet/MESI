import sqlite3
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


db = 'database.db'
conn = sqlite3.connect(db)
cursor = conn.cursor()

# Création de la table "users" si elle n'existe pas
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN
    )
''')

# Création de la table "historique" si elle n'existe pas
cursor.execute('''
    CREATE TABLE IF NOT EXISTS historique (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        date TEXT,
        nelat FLOAT,
        nelng FLOAT,
        swlat FLOAT,
        swlng FLOAT,
        espece TEXT,
        nb_observation INTEGER


    )
''')

cursor.execute('SELECT * FROM users WHERE is_admin = 1')
users = cursor.fetchall()

if len(users) <= 0:
    cursor.execute(
        'INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)', ('admin', 'admin', 1))
    cursor.execute(
        'INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)', ('user', 'user', 0))
    conn.commit()

conn.close()


@app.route('/api/data', methods=['POST'])
def handle_data():
    conn = sqlite3.connect(db)
    cursor = conn.cursor()

    success: bool = False
    data = request.get_json()

    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    for u in users:
        if u[1] == data['username'] and u[2] == data['password'] and u[3] == 1:
            success = True
            if u[3] == 1:
                admin = True
            elif u[3] == 0:
                admin = False

    conn.close()
    return jsonify({'success': success, 'admin': admin})


@app.route('/api/historique', methods=['GET'])
def get_historique():
    conn = sqlite3.connect(db)
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM historique')
    historique = cursor.fetchall()

    conn.close()
    return jsonify({'historique': historique})


@app.route('/api/historique', methods=['POST'])
def add_historique():
    conn = sqlite3.connect(db)
    cursor = conn.cursor()

    data = request.get_json()

    # Insérer les données de l'historique dans la table
    cursor.execute('INSERT INTO historique (user, date, nelat, nelng, swlat, swlng, espece, nb_observation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                   (data['user'], data['date'], data['nelat'], data['nelng'], data['swlat'], data['swlng'], data['espece'], data['nb_observation']))
    conn.commit()

    conn.close()
    return jsonify({'message': 'Historique added successfully'})


@app.route('/api/historique/<int:id>', methods=['PUT'])
def update_historique(id):
    conn = sqlite3.connect(db)
    cursor = conn.cursor()

    data = request.get_json()

    # Mettre à jour les données de l'historique dans la table
    cursor.execute('UPDATE historique SET user = ?, date = ?, nelat = ?, nelng = ?, swlat = ?, swlng = ?, espece = ?, nb_observation = ? WHERE id = ?',
                   (data['user'], data['date'], data['nelat'], data['nelng'], data['swlat'], data['swlng'], data['espece'], data['nb_observation'], id))
    conn.commit()

    conn.close()
    return jsonify({'message': 'Historique updated successfully'})


@app.route('/api/historique/<int:id>', methods=['DELETE'])
def delete_historique(id):
    conn = sqlite3.connect(db)
    cursor = conn.cursor()

    # Supprimer l'historique correspondant à l'ID donné
    cursor.execute('DELETE FROM historique WHERE id = ?', (id,))
    conn.commit()

    conn.close()
    return jsonify({'message': 'Historique deleted successfully'})


@app.route('/')
def index():
    return render_template('hello.html')


if __name__ == '__main__':
    app.run()
