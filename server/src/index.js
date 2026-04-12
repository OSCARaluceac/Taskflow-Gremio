const express = require('express');
const cors = require('cors');
const path = require('path'); // Sensor de rutas absolutas
const { port } = require('./config/env');
const taskRoutes = require('./routes/task.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// --- 1. Configuración de Swagger (Protocolo de Red) ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TaskFlow API - Gremio de Aventureros',
            version: '1.0.0',
            description: 'Documentación técnica de la API de gestión de misiones.',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Servidor Local' },
            { url: 'https://taskflow-gremio.vercel.app', description: 'Servidor Producción' }
        ],
    },
    // Usamos path.join para evitar que Vercel pierda el rastro de los archivos
    apis: [path.join(__dirname, './routes/*.js')], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// --- 2. Middlewares Globales ---
app.use(cors());
app.use(express.json());

// Middleware de Auditoría
app.use((req, res, next) => {
    const inicio = performance.now();
    res.on('finish', () => { 
        const duracion = performance.now() - inicio;
        console.log(`[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion.toFixed(2)}ms)`);
    });
    next();
});

// --- 3. Puntos de Entrada ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/v1/tasks', taskRoutes);

// --- 4. Manejo Global de Errores ---
app.use((err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`);
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: "Recurso no encontrado." });
    }
    res.status(500).json({ 
        error: "Error interno del servidor. Protocolo de emergencia activo." 
    });
});

// Exportamos la app para que Vercel la gestione correctamente
module.exports = app; 

app.listen(port, () => {
    console.log(`[SISTEMA]: Servidor operativo en el puerto ${port}`);
});