const express = require('express');
const cors = require('cors');
const { port } = require('./config/env');
const taskRoutes = require('./routes/task.routes');
const swaggerUi = require('swagger-ui-express');

const app = express();

// --- 1. CONFIGURACIÓN DE SWAGGER (En JavaScript Puro) ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'TaskFlow API - Gremio de Aventureros', version: '1.0.0' },
  servers: [
    { url: 'https://taskflow-gremio.vercel.app', description: 'Producción' },
    { url: 'http://localhost:3000', description: 'Local' }
  ],
  paths: {
    '/api/v1/tasks': {
      get: { summary: 'Obtener todas las misiones', responses: { '200': { description: 'Éxito' } } },
      post: { summary: 'Crear misión', responses: { '201': { description: 'Creada' } } }
    },
    '/api/v1/tasks/{id}': {
      patch: { 
        summary: 'Completar misión', 
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Actualizada' } } 
      },
      delete: { 
        summary: 'Eliminar misión', 
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Eliminada' } } 
      }
    }
  }
};

// --- 2. MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(express.json());

// --- 3. RUTAS Y DOCUMENTACIÓN ---
// Ya no usamos swaggerJsdoc. Pasamos el documento directamente.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/tasks', taskRoutes);

// --- 4. MANEJO DE ERRORES ---
app.use((err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`);
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: "No encontrado." });
    res.status(500).json({ error: "Error interno." });
});

// --- 5. EXPORTACIÓN VERCEL ---
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(port || 3000, () => console.log(`[SISTEMA]: Servidor en puerto ${port || 3000}`));
}