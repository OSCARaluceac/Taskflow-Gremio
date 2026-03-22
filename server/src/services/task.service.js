// server/src/services/task.service.js

let tasks = []; // Nuestra persistencia temporal

const getAll = () => tasks;

const create = (taskData) => {
    const newTask = {
        id: Date.now().toString(), // Generamos un ID único temporal
        ...taskData,
        completed: false,
        createdAt: new Date()
    };
    tasks.push(newTask);
    return newTask;
};

const remove = (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('NOT_FOUND');
    
    tasks.splice(index, 1);
    return true;
};

module.exports = { getAll, create, remove };