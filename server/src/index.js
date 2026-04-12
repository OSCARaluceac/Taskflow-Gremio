const express = require('express');
const cors = require('cors');
const path = require('path');
const { port } = require('./config/env');
const taskRoutes = require('./routes/task.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// --- 1. CONFIGURACIÓN DE SWAGGER ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TaskFlow API - Gremio de Aventureros',
            version: '1.0.0',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Local' },
            { url: 'https://taskflow-gremio.vercel.app', description: 'Producción' }
        ],
    },
    // 🔥 RUTA ABSOLUTA PARA EVITAR EL 404 EN VERCEL
    apis: [path.join(process.cwd(), 'server/src/routes/*.js')], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// --- 2. MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- 3. RUTAS ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/v1/tasks', taskRoutes);

// --- 4. EXPORTACIÓN PARA VERCEL (CRÍTICO) ---
// En la nube, Vercel no usa app.listen, usa este export
module.exports = app; 

// Solo encendemos el puerto si estamos en local
if (process.env.NODE_ENV !== 'production') {
    app.listen(port || 3000, () => {
        console.log(`[SISTEMA]: Servidor en puerto ${port || 3000}`);
    });
}