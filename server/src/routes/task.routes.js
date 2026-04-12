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
 * description: ID único generado por el servidor.
 * title:
 * type: string
 * description: El nombre de la misión.
 * categoria:
 * type: string
 * description: Tipo de misión (Caza, Escolta, etc.).
 * rango:
 * type: string
 * description: Grado de dificultad (D, C, B, A, S).
 * completed:
 * type: boolean
 * description: Estado actual de la misión.
 */

/**
 * @swagger
 * /api/v1/tasks:
 * get:
 * summary: Recuperar el tablón de misiones completo.
 * tags: [Misiones]
 * responses:
 * 200:
 * description: Lista de misiones obtenida con éxito.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Task'
 */
router.get('/', taskController.getTasks);

/**
 * @swagger
 * /api/v1/tasks:
 * post:
 * summary: Registrar una nueva misión en el Gremio.
 * tags: [Misiones]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Task'
 * responses:
 * 201:
 * description: Misión creada y registrada.
 * 400:
 * description: Datos de entrada inválidos.
 */
router.post('/', taskController.createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 * patch:
 * summary: Actualizar el estado de una misión (Completada/Pendiente).
 * tags: [Misiones]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: ID de la misión a modificar.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * completed:
 * type: boolean
 * responses:
 * 200:
 * description: Estado actualizado correctamente.
 * 404:
 * description: Misión no encontrada.
 */
router.patch('/:id', taskController.updateTaskStatus);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 * delete:
 * summary: Retirar una misión del tablón permanentemente.
 * tags: [Misiones]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: ID de la misión a eliminar.
 * responses:
 * 204:
 * description: Misión eliminada con éxito.
 * 404:
 * description: El objetivo no existe en el registro.
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;