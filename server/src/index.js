// --- 1. CONFIGURACIÓN DE SWAGGER (Documentación Exhaustiva) ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: { 
    title: 'TaskFlow API - Gremio de Aventureros', 
    version: '1.0.0',
    description: 'Documentación técnica exhaustiva de la API de gestión de misiones. Incluye contratos de red, esquemas de datos y manejo de excepciones (Fase 3).'
  },
  servers: [
    { url: 'https://taskflow-gremio.vercel.app', description: 'Servidor de Producción (Vercel)' },
    { url: 'http://localhost:3000', description: 'Servidor Local (Desarrollo)' }
  ],
  components: {
    schemas: {
      Task: {
        type: 'object',
        required: ['title', 'categoria', 'rango'],
        properties: {
          id: { type: 'string', description: 'ID autogenerado único de la misión.' },
          title: { type: 'string', description: 'Nombre del encargo (Mínimo 3 caracteres).' },
          categoria: { type: 'string', description: 'Tipo de misión (ej. Caza, Escolta).' },
          rango: { type: 'string', description: 'Rango de dificultad (S, A, B, C, D).' },
          completed: { type: 'boolean', description: 'Estado actual de la misión.' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', description: 'Mensaje detallado del fallo del sistema.' }
        }
      }
    }
  },
  paths: {
    '/api/v1/tasks': {
      get: { 
        summary: 'Sincronizar el Tablón de Misiones', 
        description: 'Obtiene la lista completa de todas las misiones registradas en la memoria del servidor.',
        responses: { 
          '200': { 
            description: 'Lista de misiones recuperada con éxito.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } } } }
          } 
        } 
      },
      post: { 
        summary: 'Registrar un Nuevo Contrato', 
        description: 'Añade una nueva misión al servidor. Frontera de red: Fallará si los datos no cumplen los requisitos estrictos.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } }
        },
        responses: { 
          '201': { 
            description: 'Misión creada y registrada en el sistema.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } }
          },
          '400': { 
            description: 'Datos inválidos (Bad Request). Ej: Falta título, o es muy corto.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        } 
      }
    },
    '/api/v1/tasks/{id}': {
      patch: { 
        summary: 'Actualizar Estado de Misión', 
        description: 'Aplica una mutación granular (PATCH) para marcar una misión como completada o pendiente.',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID de la misión a modificar.' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { completed: { type: 'boolean' } } } } }
        },
        responses: { 
          '200': { description: 'Estado actualizado correctamente.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
          '400': { description: 'Validación fallida: El valor enviado no es un booleano válido.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '404': { description: 'El ID proporcionado no coincide con ninguna misión activa (Not Found).', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Fallo interno crítico del servidor.' }
        } 
      },
      delete: { 
        summary: 'Eliminar Registro de Misión', 
        description: 'Borra permanentemente una misión de los archivos del gremio. Idempotente.',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID único de la misión.' }],
        responses: { 
          '204': { description: 'Operación exitosa. Misión eliminada (No Content).' },
          '404': { description: 'La misión que intentas eliminar ya no existe en la base de datos.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        } 
      }
    }
  }
};
// --- FIN DE LA CONFIGURACIÓN DE SWAGGER ---