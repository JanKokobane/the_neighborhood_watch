from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, methods=['GET', 'POST', 'DELETE'])

# Configure the database connection pool
dbconfig = {
    "database": "neighborhood_watch",
    "user": "root",
    "password": "Mojancko@01",
    "host": "localhost"
}

pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool",
                                                   pool_size=10,
                                                   pool_reset_session=True,
                                                   **dbconfig)

@app.route('/signup', methods=['POST'])
def signup():
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()
        username = data.get('username')
        fullname = data.get('fullname')
        email = data.get('email')
        password = data.get('password')

        query = "SELECT * FROM users WHERE username = %s OR email = %s"
        cursor.execute(query, (username, email))
        existing_user = cursor.fetchone()
        
        if existing_user:
            return jsonify({"error": "Username or Email already exists!"}), 400

        query = "INSERT INTO users (username, fullname, email, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (username, fullname, email, password))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    finally:
        cursor.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        query = "SELECT * FROM users WHERE email = %s AND password = %s"
        cursor.execute(query, (email, password))
        user = cursor.fetchone()

        if user:
            return jsonify({"message": "Login successful!", "redirect_url": "user-dashboard.html"}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    finally:
        cursor.close()
        conn.close()

@app.route('/dashboard', methods=['GET'])
def dashboard():
    dashboard_data = {
        "total_users": 150,
        "reports_received": 45,
        "active_cases": 12
    }
    return jsonify(dashboard_data)

@app.route('/report-incident', methods=['POST'])
def report_incident():
    conn = pool.get_connection()
    cursor = conn.cursor()
    try:
        data = request.form
        incident_type = data.get('incidentType')
        description = data.get('incidentDescription')
        location = data.get('incidentLocation')
        photo = request.files.get('incidentPhoto')

        if photo:
            photo_data = photo.read()
            query = "INSERT INTO incidents (incident_type, description, location, photo) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (incident_type, description, location, photo_data))
        else:
            query = "INSERT INTO incidents (incident_type, description, location) VALUES (%s, %s, %s)"
            cursor.execute(query, (incident_type, description, location))

        conn.commit()
        return jsonify({"message": "Incident reported successfully!"}), 201
    finally:
        cursor.close()
        conn.close()

@app.route('/admin-signup', methods=['POST'])
def admin_signup():
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        query = "SELECT * FROM admins WHERE username = %s"
        cursor.execute(query, (username,))
        existing_admin = cursor.fetchone()
        
        if existing_admin:
            return jsonify({"error": "Admin already exists! Please Register a new Admin"}), 400

        query = "INSERT INTO admins (username, password) VALUES (%s, %s)"
        cursor.execute(query, (username, password))
        conn.commit()
        return jsonify({"message": "Admin registered successfully!"}), 201
    finally:
        cursor.close()
        conn.close()

@app.route('/admin-login', methods=['POST'])
def admin_login():
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        query = "SELECT * FROM admins WHERE username = %s AND password = %s"
        cursor.execute(query, (username, password))
        admin = cursor.fetchone()

        if admin:
            return jsonify({"message": "Login successful!", "redirect_url": "admin-dashboard.html"}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    finally:
        cursor.close()
        conn.close()

@app.route('/send-alert', methods=['POST'])
def send_alert():
    conn = pool.get_connection()
    cursor = conn.cursor()
    try:
        data = request.get_json()
        title = data.get('alertTitle')
        message = data.get('alertMessage')
        priority = data.get('alertPriority')

        query = "INSERT INTO alerts (title, message, priority) VALUES (%s, %s, %s)"
        cursor.execute(query, (title, message, priority))
        conn.commit()
        return jsonify({"message": "Alert sent successfully!"}), 201
    finally:
        cursor.close()
        conn.close()

@app.route('/create-event', methods=['POST'])
def create_event():
    conn = pool.get_connection()
    cursor = conn.cursor()
    try:
        data = request.get_json()
        title = data.get('eventTitle')
        event_date = data.get('eventDate')
        location = data.get('eventLocation')
        description = data.get('eventDescription')

        query = "INSERT INTO events (title, event_date, location, description) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (title, event_date, location, description))
        conn.commit()
        return jsonify({"message": "Event created successfully!"}), 201
    finally:
        cursor.close()
        conn.close()

@app.route('/fetch-users', methods=['GET'])
def fetch_users():
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT username, email FROM users"
        cursor.execute(query)
        users = cursor.fetchall()
        return jsonify(users)
    finally:
        cursor.close()
        conn.close()

@app.route('/delete-user/<username>', methods=['DELETE'])
def delete_user(username):
    conn = pool.get_connection()
    cursor = conn.cursor()
    try:
        query = "DELETE FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        conn.commit()
        return jsonify({"message": "User deleted successfully!"}), 200
    finally:
        cursor.close()
        conn.close()

@app.route('/admin-overview', methods=['GET'])
def admin_overview():
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT COUNT(*) AS total_users FROM users")
        total_users = cursor.fetchone()['total_users']

        cursor.execute("SELECT COUNT(*) AS total_incidents FROM incidents")
        total_incidents = cursor.fetchone()['total_incidents']

        cursor.execute("SELECT COUNT(*) AS total_alerts FROM alerts")
        total_alerts = cursor.fetchone()['total_alerts']

        overview_data = {
            "total_users": total_users,
            "total_incidents": total_incidents,
            "total_alerts": total_alerts
        }

        return jsonify(overview_data)
    finally:
        cursor.close()
        conn.close()

@app.route('/fetch-incidents', methods=['GET'])
def fetch_incidents():
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT incident_id, incident_type, description, location, reported_at FROM incidents"
        cursor.execute(query)
        incidents = cursor.fetchall()
        return jsonify(incidents)
    finally:
        cursor.close()
        conn.close()

@app.route('/delete-incident/<incident_id>', methods=['DELETE'])
def delete_incident(incident_id):
    conn = pool.get_connection()
    cursor = conn.cursor()
    try:
        query = "DELETE FROM incidents WHERE incident_id = %s"
        cursor.execute(query, (incident_id,))
        conn.commit()
        return jsonify({"message": "Incident deleted successfully!"}), 200
    finally:
        cursor.close()
        conn.close()

@app.route('/user-overview', methods=['GET'])
def user_overview():
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
      
        cursor.execute("SELECT COUNT(*) AS recent_incidents FROM incidents WHERE reported_at > NOW() - INTERVAL 7 DAY")
        recent_incidents = cursor.fetchone()['recent_incidents']

        cursor.execute("SELECT COUNT(*) AS active_alerts FROM alerts WHERE status = 'active'")
        active_alerts = cursor.fetchone()['active_alerts']

        cursor.execute("SELECT COUNT(*) AS upcoming_events FROM events WHERE event_date > NOW() AND event_date < NOW() + INTERVAL 30 DAY")
        upcoming_events = cursor.fetchone()['upcoming_events']

        overview_data = {
            "recent_incidents": recent_incidents,
            "active_alerts": active_alerts,
            "upcoming_events": upcoming_events
        }

        return jsonify(overview_data)
    finally:
        cursor.close()
        conn.close()

@app.route('/fetch-alerts', methods=['GET'])
def fetch_alerts():
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT title, message, priority FROM alerts WHERE status = 'active'"
        cursor.execute(query)
        alerts = cursor.fetchall()
        return jsonify(alerts)
    finally:
        cursor.close()
        conn.close()

@app.route('/fetch-events', methods=['GET'])
def fetch_events():
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT title, event_date, location, description FROM events"
        cursor.execute(query)
        events = cursor.fetchall()
        return jsonify(events)
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    app.run(port=5000)
