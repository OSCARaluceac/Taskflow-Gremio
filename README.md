# ⚔️ TaskFlow // Sistema de Gestión del Gremio (Fullstack Edition)

TaskFlow es una herramienta de despliegue táctico de vanguardia. En esta Fase 3, el sistema ha evolucionado de una persistencia local a una **arquitectura Cliente-Servidor (Node.js/Express)**, permitiendo una gestión de misiones centralizada, robusta y escalable bajo los principios fundamentales de la ingeniería de software.

---

## 🚀 Funcionalidades Avanzadas (Protocolo de Red)

* **📡 Sincronización en Tiempo Real:** Las misiones ya no dependen del navegador; se almacenan en un servidor dedicado de Node.js operando de forma asíncrona.
* **🛡️ Validación Defensiva:** La frontera de red actúa como filtro de seguridad, rechazando contratos incompletos o mal formados (Error 400) antes de que toquen la lógica de negocio.
* **⏳ Gestión de Estados de Red:** Interfaz con feedback visual dinámico (Spinners de carga y alertas de error) para gestionar la latencia del mundo real.
* **⚖️ Algoritmos de Priorización:** Búsqueda y filtrado multicapa con jerarquización automática de objetivos críticos (Rango S).

---

## 🏗️ Arquitectura del Sistema (Separation of Concerns)

Para garantizar la estabilidad y el mantenimiento del Gremio en operaciones a gran escala, hemos implementado una arquitectura estricta de tres capas unidireccionales:

1. **Capa de Rutas (`routes`):** Define los puntos de entrada legales a la API. Mapea la URL y el verbo HTTP hacia el controlador correspondiente. Es una capa sin lógica de toma de decisiones.
2. **Capa de Controladores (`controllers`):** Directores de orquesta. Extraen los datos de red (`req.body`), ejecutan la validación defensiva estricta, invocan a los servicios y formatean la respuesta HTTP (`res.status`).
3. **Capa de Servicios (`services`):** El núcleo intelectual. Contiene la lógica pura de negocio y la gestión de la memoria del sistema. Desconoce por completo la existencia de Express o el protocolo HTTP.

---

## ⚙️ El Pipeline de Red (Middlewares)

El flujo de datos HTTP atraviesa una cadena de responsabilidad (Middlewares) antes de ser procesado:

* **Parseo (`express.json`):** Intercepta y transforma los payloads JSON crudos de la red en objetos JavaScript.
* **Seguridad (`cors`):** Gestiona las cabeceras de Intercambio de Recursos de Origen Cruzado.
* **Auditoría (Logger):** Middleware personalizado que registra el rendimiento (verbo, ruta, código de estado y latencia en ms).
* **Manejo Global de Excepciones:** Contención final de 4 parámetros `(err, req, res, next)` que captura fallos no controlados, mapea errores semánticos (ej. 404 para `NOT_FOUND`) y blinda el servidor contra caídas (500 Internal Server Error).

---

## 📖 Documentación y Contratos de API (RESTful)

El servidor respeta la semántica HTTP estricta. Toda la documentación interactiva, esquemas de datos y códigos de error están desplegados en la nube mediante **Swagger (OpenAPI)** utilizando un bypass de CDN para operar en entornos Serverless.

> **📍 Portal de Inteligencia (Swagger):** [https://taskflow-gremio.vercel.app/api-docs](https://taskflow-gremio.vercel.app/api-docs)

### Ejemplos de Interacción (Request / Response)

#### 1. Registrar Misión (POST `/api/v1/tasks`) - *No Idempotente*
* **Request:** `{ "title": "Cazar un dragón", "categoria": "Caza", "rango": "S" }`
* **Response (201 Created):** `{ "id": "uuid-1234", "title": "Cazar un dragón", "completed": false }`
* **Error Forzado (400 Bad Request):** Si se omite el título. `{ "error": "El título es obligatorio." }`

#### 2. Modificación Granular (PATCH `/api/v1/tasks/:id`)
* **Request:** `{ "completed": true }`
* **Response (200 OK):** `{ "id": "uuid-1234", "title": "Cazar un dragón", "completed": true }`

#### 3. Eliminar Registro (DELETE `/api/v1/tasks/:id`) - *Idempotente*
* **Response (204 No Content):** Operación exitosa, sin cuerpo de respuesta.
* **Error Forzado (404 Not Found):** Si el ID no existe en los registros. `{ "error": "La misión especificada no existe." }`

---

## 🛠️ Tecnologías del Gremio

### Frontend (Client)
* **Vanilla JavaScript (ES6+):** Uso de `fetch` API para peticiones asíncronas.
* **Tailwind CSS:** Diseño táctico responsivo.

### Backend (Server)
* **Node.js & Express.js:** Entorno de ejecución single-thread asíncrono y framework de enrutamiento.
* **Swagger-UI-Express / Swagger-Jsdoc:** Generación de documentación interactiva.
* **Dotenv:** Implementación de la metodología *12-Factor App* para proteger variables de entorno.

---

## 📥 Instalación y Despliegue Táctico

Para inicializar el servidor localmente, sigue estas coordenadas exactas:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/OSCARaluceac/Tablon_De_Misiones.git](https://github.com/OSCARaluceac/Tablon_De_Misiones.git)
   cd Tablon_De_Misiones