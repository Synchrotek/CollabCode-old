import './TodoApp.css'
import React, { useState, useEffect } from 'react';

const TodoApp = () => {
    const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('todos')) || []);
    const [editTodoId, setEditTodoId] = useState(-1);

    const [newTodo, setNewTodo] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('1');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const saveTodo = () => {
        const isEmpty = (newTodo.trim() === '' && deadline === '');

        if (deadline === '' && !isEmpty) setDeadline(calcDeadline());
        console.log('Deadline', deadline);

        if (isEmpty) {
            alert("Todo's input is Empty");
            return;
        }
        // const isDuplicate = todos && todos.some((todo) => todo.value.toUpperCase() === newTodo.toUpperCase());

        // if (isDuplicate) {
        //     alert("This todo is Already present");
        //     return;
        // }

        if (editTodoId >= 0) {
            setTodos((prevTodos) =>
                prevTodos.map((todo, index) => ({
                    ...todo,
                    value: index === editTodoId ? newTodo : todo.value,
                    deadline: index === editTodoId ? deadline : todo.deadline,
                    priority: index === editTodoId ? priority : todo.priority,
                }))
            );
            setEditTodoId(-1);
        } else {
            const todo = {
                value: newTodo,
                deadline,
                priority,
                checked: false,
            };
            setTodos((prevTodos) => [...prevTodos, todo]);
        }

        setNewTodo('');
        setDeadline('');
    };

    const calcDeadline = (deadline) => {
        let dateString;
        if (deadline) {
            const date = new Date(deadline);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            dateString = `${day}:${month}:${year}`;
        } else {
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            dateString = `${day}:${month}:${year}`;
        }
        return dateString;
    };

    const checkTodo = (todoId) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo, index) => ({
                ...todo,
                checked: index === todoId ? !todo.checked : todo.checked,
            }))
        );
    };

    const editTodo = (todoId) => {
        setNewTodo(todos[todoId].value);
        setDeadline(todos[todoId].deadline);
        setPriority(todos[todoId].priority);
        setEditTodoId(todoId);
    };

    const deleteTodo = (todoId) => {
        setTodos((prevTodos) => prevTodos.filter((todo, index) => index !== todoId));
        setEditTodoId(-1);
    };

    const sortTodos = () => {
        console.log(todos);
        setTodos((prevTodos) =>
            prevTodos.slice().sort((a, b) => {
                const priorityA = a.priority || ""; // Default to an empty string if priority is undefined
                const priorityB = b.priority || "";

                const priorityComparison = priorityA.localeCompare(priorityB);

                if (priorityComparison === 0) {
                    return new Date(a.deadline) - new Date(b.deadline);
                }

                return priorityComparison;
            })
        );
        console.log(todos);
    };

    return (
        <div className="container">
            <div className="header">
                <h1>TO DO</h1>
            </div>
            <div className="new-todo">
                <form onSubmit={(e) => e.preventDefault()} id='todoform'>
                    <input
                        id='newtodo'
                        type="text"
                        name="newtodo"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Enter Task .."
                    />
                    <div>
                        <select id="priority" name="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="1">High</option>
                            <option value="2">Medium</option>
                            <option value="3">Low</option>
                        </select>
                        <input type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    </div>
                    <div>
                        <button type="submit" onClick={saveTodo}>
                            {editTodoId >= 0 ? 'Edit' : 'Add'}
                        </button>
                        <button type="button" onClick={sortTodos} id="sort-todos"></button>
                    </div>
                </form>
            </div>

            <hr />

            <div id="todo-list">
                {todos.map((todo, index) => (
                    <div className="todo" key={index}>
                        <i
                            className={todo.checked ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}
                            data-action="check"
                            onClick={() => checkTodo(index)}
                        ></i>
                        <p className={todo.checked ? 'checked' : ''} onClick={() => checkTodo(index)}>
                            {todo.value}
                        </p>
                        <span className="deadline">{calcDeadline(todo.deadline)}</span>
                        <span className="priority-label">
                            {todo.priority === '1' ? 'High' : todo.priority === '2' ? 'Medium' : 'Low'}
                            <span className="deadline-2">{calcDeadline(todo.deadline)}</span>
                        </span>
                        <i className="fa-solid fa-pen-to-square edit-todo" data-action="edit" onClick={() => editTodo(index)}></i>
                        <i className="fa-solid fa-delete-left" data-action="delete" onClick={() => deleteTodo(index)}></i>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoApp;
