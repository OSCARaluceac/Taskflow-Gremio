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
 * description: ID autogenerado.
 * title:
 * type: string
 * description: Nombre de la misión.
 * categoria:
 * type: string
 * description: Tipo de encargo.
 * rango:
 * type: string
 * description: Dificultad (D-S).
 * completed:
 * type: boolean
 * description: Estado.
 */

/**
 * @swagger
 * /api/v1/tasks:
 * get:
 * summary: Obtener todas las misiones.
 * responses:
 * 200:
 * description: Lista recuperada.
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
 * description: Creado.
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
 * description: Actualizado.
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
 * description: Eliminado.
 */
router.patch('/:id', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;