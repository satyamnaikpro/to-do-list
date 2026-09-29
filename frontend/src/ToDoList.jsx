import React, { useState, useEffect } from "react";

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    function loadTasks() {
        fetch("http://localhost:8000/tasks")
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error(err));
    }

    function handleInputChange(e) {
        setNewTask(e.target.value);
    }

    function addTask() {
        if (newTask.trim() === "") return;

        fetch("http://localhost:8000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: newTask
            })
        })
            .then(res => res.json())
            .then(task => {
                setTasks([...tasks, task]);
                setNewTask("");
            });
    }

    function deleteTask(id) {
        fetch(`http://localhost:8000/tasks/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                setTasks(tasks.filter(task => task.id !== id));
            });
    }

    function editTask(task) {
        setEditingId(task.id);
        setNewTask(task.title);
    }

    function saveTask() {
        if (newTask.trim() === "") return;

        fetch(`http://localhost:8000/tasks/${editingId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: newTask
            })
        })
            .then(res => res.json())
            .then(updatedTask => {
                setTasks(tasks.map(task =>
                    task.id === editingId ? updatedTask : task
                ));
                setEditingId(null);
                setNewTask("");
            });
    }

    function moveTaskUp(index) {
        if (index === 0) return;

        const updated = [...tasks];

        [updated[index], updated[index - 1]] =
            [updated[index - 1], updated[index]];

        setTasks(updated);
    }

    function moveTaskDown(index) {
        if (index === tasks.length - 1) return;

        const updated = [...tasks];

        [updated[index], updated[index + 1]] =
            [updated[index + 1], updated[index]];

        setTasks(updated);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (editingId === null) {
            addTask();
        } else {
            saveTask();
        }
    }

    return (
        <div className="App">
            <h1>To-Do List</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter task..."
                    value={newTask}
                    onChange={handleInputChange}
                />

                <button type="submit" className="add-button">
                    {editingId === null ? "Add" : "Save"}
                </button>
            </form>

            <ol>
                {tasks.map((task, index) => (
                    <li key={task.id}>
                        <span className="text">{task.title}</span>

                        <button
                            className="delete-button"
                            onClick={() => deleteTask(task.id)}
                        >
                            Delete
                        </button>

                        <button
                            className="delete-button"
                            onClick={() => moveTaskUp(index)}
                        >
                            Up
                        </button>

                        <button
                            className="delete-button"
                            onClick={() => moveTaskDown(index)}
                        >
                            Down
                        </button>

                        <button
                            className="delete-button"
                            onClick={() => editTask(task)}
                        >
                            Update
                        </button>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default ToDoList;