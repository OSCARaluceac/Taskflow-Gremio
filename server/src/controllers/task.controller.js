const taskService = require('../services/task.service');

/**
 * Obtiene todas las misiones del registro central.
 */
const getTasks = (req, res) => {
    const tasks = taskService.getAll();
    res.status(200).json(tasks);
};

/**
 * Registra un nuevo contrato validando los parámetros del Gremio.
 */
const createTask = (req, res) => {
    const { title, categoria, rango, priority } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
        return res.status(400).json({ error: "El título es obligatorio (mínimo 3 caracteres)." });
    }
    
    if (!categoria || !rango) {
        return res.status(400).json({ error: "Categoría y Rango son campos obligatorios." });
    }

    const newTask = taskService.create({ 
        title, 
        categoria, 
        rango, 
        priority: priority || 1 
    });
    
    res.status(201).json(newTask);
};

/**
 * Actualiza el estado de una misión (Completada/Pendiente).
 */
const updateTaskStatus = (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        if (typeof completed !== 'boolean') {
            return res.status(400).json({ error: "El estado debe ser booleano." });
        }

        const updatedTask = taskService.updateStatus(id, completed);
        res.status(200).json(updatedTask);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: "La misión especificada no existe." });
        }
        res.status(500).json({ error: "Fallo crítico en el sistema de actualización." });
    }
};

/**
 * Elimina un registro permanentemente.
 */
const deleteTask = (req, res) => {
    try {
        const { id } = req.params;
        taskService.remove(id);
        res.status(204).send(); 
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: "La misión que intentas eliminar no existe." });
        }
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = { getTasks, createTask, updateTaskStatus, deleteTask };