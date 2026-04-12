const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

/**
 * @swagger
 * components:
 * schemas:
 * Task:
 * type: object
 * required:
 * - title
 * - categoria
 * - rango
 * properties:
 * id:
 * type: string
 * description: ID único de la misión.
 * title:
 * type: string
 * description: Nombre del encargo.
 * categoria:
 * type: string
 * description: Tipo de misión.
 * rango:
 * type: string
 * description: Dificultad (D, C, B, A, S).
 * completed:
 * type: boolean
 * description: Estado de la misión.
 */

/**
 * @swagger
 * /api/v1/tasks:
 * get:
 * summary: Obtener todas las misiones.
 * responses:
 * 200:
 * description: Lista recuperada con éxito.
 * post:
 * summary: Registrar una nueva misión.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Task'
 * responses:
 * 201:
 * description: Misión creada correctamente.
 */
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 * patch:
 * summary: Alternar estado de completado.
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * completed:
 * type: boolean
 * responses:
 * 200:
 * description: Estado actualizado.
 * delete:
 * summary: Eliminar una misión.
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 204:
 * description: Registro eliminado del tablón.
 */
router.patch('/:id', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;