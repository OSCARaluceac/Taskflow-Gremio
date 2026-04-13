const express = require('express');
const cors = require('cors');
const { port } = require('./config/env');
const taskRoutes = require('./routes/task.routes');
const swaggerUi = require('swagger-ui-express');

const app = express();

// --- 1. CONFIGURACIÓN DE SWAGGER (Exhaustiva) ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: { 
    title: 'TaskFlow API - Gremio de Aventureros', 
    version: '1.0.0',
    description: 'Documentación técnica exhaustiva de la API de gestión de misiones. Incluye contratos de red, esquemas de datos y manejo de excepciones (Fase 3).'
  },
  servers: [
    { url: 'https://taskflow-gremio.vercel.app', description: 'Servidor de Producción (Vercel)' },
    { url: 'http://localhost:3000', description: 'Servidor Local' }
  ],
  components: {
    schemas: {
      Task: {
        type: 'object',
        required: ['title', 'categoria', 'rango'],
        properties: {
          id: { type: 'string', description: 'ID autogenerado único.' },
          title: { type: 'string', description: 'Nombre del encargo (Mín. 3 caracteres).' },
          categoria: { type: 'string', description: 'Tipo de misión.' },
          rango: { type: 'string', description: 'Dificultad (S, A, B, C, D).' },
          completed: { type: 'boolean', description: 'Estado actual.' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', description: 'Mensaje del fallo del sistema.' }
        }
      }
    }
  },
  paths: {
    '/api/v1/tasks': {
      get: { 
        summary: 'Obtener misiones', 
        responses: { '200': { description: 'Éxito.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } } } } } } 
      },
      post: { 
        summary: 'Registrar misión', 
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
        responses: { 
          '201': { description: 'Creada.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          '400': { description: 'Datos inválidos.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        } 
      }
    },
    '/api/v1/tasks/{id}': {
      patch: { 
        summary: 'Actualizar estado', 
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { completed: { type: 'boolean' } } } } } },
        responses: { 
          '200': { description: 'Actualizada.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          '400': { description: 'Fallo de validación.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '404': { description: 'No encontrada.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        } 
      },
      delete: { 
        summary: 'Eliminar misión', 
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 
          '204': { description: 'Eliminada.' },
          '404': { description: 'No encontrada.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        } 
      }
    }
  }
};

// --- 2. MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(express.json());

// --- 3. RUTAS Y DOCUMENTACIÓN (Bypass CDN) ---
const swaggerHtmlOptions = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css',
    customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js'
    ]
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerHtmlOptions));
app.use('/api/v1/tasks', taskRoutes);

// --- 4. MANEJO DE ERRORES ---
app.use((err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`);
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: "No encontrado." });
    res.status(500).json({ error: "Error interno." });
});

// --- 5. EXPORTACIÓN VERCEL (CRÍTICO) ---
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(port || 3000, () => console.log(`[SISTEMA]: Servidor en puerto ${port || 3000}`));
}