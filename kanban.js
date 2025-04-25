document.addEventListener("DOMContentLoaded", function () {
    const kanbanBoard = document.getElementById("kanban");
    const tasks = [
        { id: 1, name: "Task 1", status: "To Do", progress: 10, priority: "High", assigned_to: "John" },
        { id: 2, name: "Task 2", status: "In Progress", progress: 50, priority: "Medium", assigned_to: "Alice" },
        { id: 3, name: "Task 3", status: "Completed", progress: 100, priority: "Low", assigned_to: "Bob" },
    ];

    function renderKanban() {
        kanbanBoard.innerHTML = "";
        const statuses = ["To Do", "In Progress", "Completed"];

        statuses.forEach(status => {
            const column = document.createElement("div");
            column.classList.add("kanban-column");
            const columnTitle = document.createElement("h3");
            columnTitle.innerText = status;
            column.appendChild(columnTitle);

            tasks.filter(task => task.status === status).forEach(task => {
                const taskCard = document.createElement("div");
                taskCard.classList.add("task-card");
                taskCard.innerHTML = `
                    <div class="task-header">
                        <strong>${task.name}</strong>
                        <div class="priority">${task.priority}</div>
                    </div>
                    <div class="progress-bar">
                        <div style="width:${task.progress}%"></div>
                    </div>
                    <p>Assigned to: ${task.assigned_to}</p>
                `;
                column.appendChild(taskCard);
            });

            kanbanBoard.appendChild(column);
        });
    }

    renderKanban();
});
