// server/src/index.js
const express = require('express');
const cors = require('cors');
const { port } = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

// --- Middlewares Globales ---
app.use(cors());
app.use(express.json());

// 1. Middleware de Auditoría (Logger)
app.use((req, res, next) => {
  const inicio = performance.now();
  res.on('finish', () => { 
    const duracion = performance.now() - inicio;
    console.log(`[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion.toFixed(2)}ms)`);
  });
  next();
});

// --- Rutas ---
app.use('/api/v1/tasks', taskRoutes);

// 2. Manejo Global de Errores (4 parámetros)
app.use((err, req, res, next) => {
  console.error(`[ERROR]: ${err.message}`);

  // Mapeo semántico: Si el servicio lanzó 'NOT_FOUND', respondemos 404
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: "Recurso no encontrado, Niko." });
  }

  // Respuesta por defecto para errores no controlados
  res.status(500).json({ 
    error: "Error interno del servidor. Protocolo de emergencia activo." 
  });
});

app.listen(port, () => {
  console.log(`[SISTEMA]: Servidor operativo en el puerto ${port}`);
});

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Configuración de metadatos de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TaskFlow API - Gremio de Niko',
            version: '1.0.0',
            description: 'Documentación técnica de la API de gestión de misiones.',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Servidor Local' },
            { url: 'https://taskflow-gremio.vercel.app', description: 'Servidor Producción' }
        ],
    },
    apis: ['./server/src/routes/*.js'], // Indica dónde buscar las rutas para documentar
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));