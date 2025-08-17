import React, { createContext, useEffect, useState, useContext } from "react";

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Load initial tasks 
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (alive) setTasks(data);
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Add task
  const addTask = (title) => {
    const id = Date.now();
    setTasks((prev) => [...prev, { id, title, completed: false }]);
  };

  // Toggle completion by id
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask }}>
      {children}
    </TaskContext.Provider>
  );
}
