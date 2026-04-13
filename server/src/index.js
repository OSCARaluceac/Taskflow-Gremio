console.log("==================================================");
console.log("[SEÑAL DE VIDA]: VERCEL ESTÁ LEYENDO EL CÓDIGO NUEVO");
console.log("==================================================");

const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/task.routes');
const swaggerUi = require('swagger-ui-express');

const app = express();

// --- 1. CONFIGURACIÓN DE SWAGGER (Nivel Máximo) ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: { 
    title: 'TaskFlow API - Gremio de Aventureros', 
    version: '2.0.0',
    description: 'Documentación técnica exhaustiva de la API. Incluye contratos de red, parámetros de filtrado, esquemas de validación y simulación de seguridad táctica.',
    contact: {
      name: 'Comandante Niko',
      url: 'https://github.com/OSCARaluceac/Tablon_De_Misiones'
    }
  },
  servers: [
    { url: 'https://taskflow-gremio.vercel.app', description: 'Servidor de Producción (Vercel)' },
    { url: 'http://localhost:3000', description: 'Servidor Local (Desarrollo)' }
  ],
  tags: [
    { name: 'Misiones', description: 'Operaciones de lectura y escritura del tablón de anuncios.' },
    { name: 'Sistema', description: 'Métricas y estado del servidor.' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Introduce un token JWT falso para probar el candado de seguridad visual.'
      }
    },
    schemas: {
      Task: {
        type: 'object',
        required: ['title', 'categoria', 'rango'],
        properties: {
          id: { type: 'string', description: 'ID autogenerado único.', example: '550e8400-e29b-41d4-a716-446655440000' },
          title: { type: 'string', description: 'Nombre del encargo.', example: 'Subyugar al Dragón de la Montaña Blanca' },
          categoria: { type: 'string', description: 'Clasificación operativa.', example: 'Caza Mayor' },
          rango: { type: 'string', description: 'Nivel de amenaza.', example: 'S' },
          completed: { type: 'boolean', description: 'Estado actual.', example: false }
        }
      },
      TaskInput: {
        type: 'object',
        required: ['title', 'categoria', 'rango'],
        properties: {
          title: { type: 'string', example: 'Escolta VIP al Bosque Élfico' },
          categoria: { type: 'string', example: 'Escolta' },
          rango: { type: 'string', example: 'A' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'El campo "title" es obligatorio y debe tener al menos 3 caracteres.' }
        }
      }
    }
  },
  paths: {
    '/api/v1/tasks': {
      get: { 
        tags: ['Misiones'],
        summary: 'Consultar el Tablón', 
        description: 'Recupera todas las misiones. Permite filtrado opcional.',
        parameters: [
          { in: 'query', name: 'rango', schema: { type: 'string' }, description: 'Filtrar por rango (S, A, B, C, D)', example: 'S' }
        ],
        responses: { 
          '200': { description: 'Lista recuperada con éxito.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } } } } } 
        } 
      },
      post: { 
        tags: ['Misiones'],
        summary: 'Registrar Nuevo Contrato', 
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } } },
        responses: { 
          '201': { description: 'Misión registrada exitosamente.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          '400': { description: 'Datos corruptos o incompletos.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        } 
      }
    },
    '/api/v1/tasks/{id}': {
      patch: { 
        tags: ['Misiones'],
        summary: 'Actualizar Estado Operativo', 
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, example: '550e8400-e29b-41d4-a716-446655440000' }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { completed: { type: 'boolean', example: true } } } } } },
        responses: { 
          '200': { description: 'Estado actualizado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          '404': { description: 'ID no localizado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        } 
      },
      delete: { 
        tags: ['Misiones'],
        summary: 'Eliminar Registro', 
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, example: '550e8400-e29b-41d4-a716-446655440000' }],
        responses: { 
          '204': { description: 'Registro purgado del servidor.' },
          '404': { description: 'El registro ya no existe.' }
        } 
      }
    }
  }
};
// --- FIN DE LA CONFIGURACIÓN ---
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