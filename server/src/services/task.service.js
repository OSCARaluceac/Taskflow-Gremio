/**
 * TASK SERVICE - El Músculo del Gremio
 * Gestiona la lógica de negocio y la persistencia en memoria.
 */

let tasks = []; // Nuestra persistencia temporal en el servidor

const getAll = () => tasks;

/**
 * Crea una nueva misión con metadatos de tiempo.
 */
const create = (taskData) => {
    const newTask = {
        id: Date.now().toString(), // Generamos un ID único basado en tiempo
        ...taskData,
        completed: false,
        createdAt: new Date()
    };
    tasks.push(newTask);
    return newTask;
};

/**
 * Actualiza el estado de una misión existente.
 * Lógica fundamental para la Fase 3.
 */
const updateStatus = (id, completed) => {
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('NOT_FOUND');
    
    task.completed = completed;
    task.updatedAt = new Date(); // Registramos el momento del éxito
    return task;
};

/**
 * Elimina un registro del tablón.
 */
const remove = (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('NOT_FOUND');
    
    tasks.splice(index, 1);
    return true;
};

module.exports = { getAll, create, updateStatus, remove };