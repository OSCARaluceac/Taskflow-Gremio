console.log("==================================================");
console.log("[SEÑAL DE VIDA]: VERCEL ESTÁ LEYENDO EL CÓDIGO NUEVO");
console.log("==================================================");

const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/task.routes');
const swaggerUi = require('swagger-ui-express');

const app = express();

// --- 1. CONFIGURACIÓN DE SWAGGER ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'TaskFlow API - Gremio de Aventureros', version: '1.0.0' },
  servers: [
    { url: 'https://taskflow-gremio.vercel.app', description: 'Vercel' },
    { url: 'http://localhost:3000', description: 'Local' }
  ],
  paths: {
    '/api/v1/tasks': {
      get: { summary: 'Obtener misiones', responses: { '200': { description: 'Éxito' } } },
      post: { summary: 'Crear misión', responses: { '201': { description: 'Creada' } } }
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
    res.status(500).json({ error: "Error interno del servidor." });
});

// --- 5. EXPORTACIÓN OBLIGATORIA PARA VERCEL ---
module.exports = app;

// --- 6. ARRANQUE LOCAL AISLADO ---
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`[SISTEMA]: Servidor operativo en el puerto ${PORT}`);
    });
}