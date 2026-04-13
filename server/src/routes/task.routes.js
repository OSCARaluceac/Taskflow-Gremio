const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// Ya no hay YAML aquí. El editor no podrá sabotearnos.
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;