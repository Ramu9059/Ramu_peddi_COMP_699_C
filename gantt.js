document.addEventListener('DOMContentLoaded', function() {
    // Data for Gantt Chart (example tasks)
    const tasks = [
        {
            label: 'Task 1',
            startDate: '2025-02-01',
            endDate: '2025-02-10',
            color: '#4CAF50'
        },
        {
            label: 'Task 2',
            startDate: '2025-02-05',
            endDate: '2025-02-15',
            color: '#FF9800'
        },
        {
            label: 'Task 3',
            startDate: '2025-02-10',
            endDate: '2025-02-20',
            color: '#2196F3'
        }
    ];

    // Prepare data for Chart.js
    const labels = tasks.map(task => task.label);
    const startDates = tasks.map(task => new Date(task.startDate).getTime());
    const endDates = tasks.map(task => new Date(task.endDate).getTime());

    // Scale down durations for better visualization (in days for simplicity)
    const durations = tasks.map((task, index) => (endDates[index] - startDates[index]) / (1000 * 3600 * 24)); // In days

    console.log("Task Data:", tasks);
    console.log("Start Dates:", startDates);
    console.log("End Dates:", endDates);
    console.log("Durations (scaled in days):", durations);

    // Get the context of the canvas where the chart will be rendered
    const canvas = document.getElementById('ganttChartCanvas');
    if (!canvas) {
        console.error("Canvas element not found!");
    }

    // Get the context of the canvas where the chart will be rendered
    const ctx = canvas.getContext('2d');

    // Check if Chart.js is being loaded correctly
    if (typeof Chart === "undefined") {
        console.error("Chart.js not loaded!");
    }

    // Create the Gantt chart using Chart.js
    const ganttChart = new Chart(ctx, {
        type: 'bar', // Use 'bar' chart type (horizontal bar in this case)
        data: {
            labels: labels,
            datasets: [{
                label: 'Project Tasks',
                data: durations,
                backgroundColor: tasks.map(task => task.color),
                borderColor: tasks.map(task => task.color),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',  // This makes the bar chart horizontal
            scales: {
                x: {
                    // Ensure x-axis has a visible range
                    min: 0,  // Start at 0
                    max: Math.max(...durations) + 5,  // Make sure the max is larger than the largest duration
                    ticks: {
                        stepSize: 1,  // Adjust step size for visibility
                        callback: function(value) {
                            return `${value} days`; // Add label "days" to tick values
                        }
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItem) {
                            const index = tooltipItem[0].index;
                            return tasks[index].label;
                        },
                        label: function(tooltipItem) {
                            const index = tooltipItem.index;
                            return 'Start: ' + new Date(startDates[index]).toLocaleDateString() + 
                                   ', End: ' + new Date(endDates[index]).toLocaleDateString();
                        }
                    }
                }
            }
        }
    });
});
