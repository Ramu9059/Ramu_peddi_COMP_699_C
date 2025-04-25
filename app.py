from flask import Flask, render_template, request
from flask import Flask, render_template, request
import mysql.connector

app = Flask(__name__)

# Connect to MySQL database
def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",  # Replace with your MySQL username
        password="dmgs37",  # Replace with your MySQL password
        database="project_management"  # Database name
    )
    return conn

@app.route('/')
def home():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Fetch all projects
    cursor.execute('SELECT * FROM projects')
    projects = cursor.fetchall()
    
    # Fetch all tasks
    cursor.execute('SELECT * FROM tasks')
    tasks = cursor.fetchall()
    
    # Fetch all team members
    cursor.execute('SELECT * FROM team_members')
    team_members = cursor.fetchall()
    
    conn.close()
    
    # Pass data to the template
    return render_template('index.html', projects=projects, tasks=tasks, team_members=team_members)

@app.route('/kanban')
def kanban():
    return render_template('kanban.html')

@app.route('/gantt')
def gantt():
    return render_template('gantt.html')

@app.route('/onboarding')
def onboarding():
    return render_template('onboarding.html')

@app.route('/team-performance')
def team_performance():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch all team members
    cursor.execute('SELECT * FROM team_members')
    team_members = cursor.fetchall()

    # Fetch task performance data with total time per member
    cursor.execute('''
        SELECT tm.name as assigned_to, SUM(t.time_spent) as total_time 
        FROM tasks t
        JOIN team_members tm ON t.assigned_to = tm.name
        GROUP BY tm.name
    ''')
    task_performance = cursor.fetchall()

    conn.close()
    
    return render_template('team_performance.html', team_members=team_members, task_performance=task_performance)


@app.route('/task/<int:task_id>', methods=['GET', 'POST'])
def task_detail(task_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Fetch task details
    cursor.execute('SELECT * FROM tasks WHERE id = %s', (task_id,))
    task = cursor.fetchone()
    
    # Fetch comments for the task
    cursor.execute('SELECT c.comment, m.name FROM comments c JOIN team_members m ON c.member_id = m.id WHERE c.task_id = %s', (task_id,))
    comments = cursor.fetchall()

    # Add a comment
    if request.method == 'POST':
        comment = request.form['comment']
        member_id = 1  # Get the current logged-in user's ID. You need a session or user authentication for this.
        cursor.execute('INSERT INTO comments (task_id, member_id, comment) VALUES (%s, %s, %s)', (task_id, member_id, comment))
        conn.commit()

    conn.close()

    return render_template('task_detail.html', task=task, comments=comments)

if __name__ == '__main__':
    app.run(debug=True)
