# ⚔️ TaskFlow // Sistema de Gestión del Gremio (Fullstack Edition)

TaskFlow es una herramienta de despliegue táctico de vanguardia. En esta Fase 3, el sistema ha evolucionado de una persistencia local a una **arquitectura Cliente-Servidor**, permitiendo una gestión de misiones centralizada, robusta y escalable.

---

## 🚀 Funcionalidades Avanzadas (Protocolo de Red)

* **📡 Sincronización en Tiempo Real:** Las misiones ya no dependen del navegador; se almacenan en un servidor dedicado de Node.js.
* **🛡️ Validación Defensiva:** El backend actúa como filtro de seguridad, rechazando contratos incompletos o mal formados (Error 400).
* **⏳ Gestión de Estados de Red:** Interfaz con feedback visual dinámico (Spinners de carga y alertas de error) para una experiencia de usuario fluida.
* **🔍 Búsqueda y Filtros Multicapa:** Localización por texto, rango (S-D) y categorías, procesados con lógica de filtrado optimizada.
* **⚖️ Ordenación por Rango S:** Algoritmo de jerarquización que prioriza objetivos críticos automáticamente.

---

## 🏗️ Arquitectura del Sistema (3 Capas)

Para garantizar la estabilidad del Gremio, hemos implementado una arquitectura separada:

1. **Capa de Rutas (Routes):** Define los puntos de entrada legales a la API.
2. **Capa de Controladores (Controllers):** Gestiona la validación de datos y la comunicación HTTP.
3. **Capa de Servicios (Services):** Contiene la lógica pura de negocio y la gestión de la memoria del sistema.

---

## 🛠️ Tecnologías del Gremio

### Frontend (Client)
* **Vanilla JavaScript (ES6+):** Uso de `fetch` asíncrono y módulos.
* **Tailwind CSS:** Diseño táctico responsivo "Parchment & Gold".

### Backend (Server)
* **Node.js & Express:** Motor de ejecución y framework de servidor.
* **CORS & Dotenv:** Seguridad de origen cruzado y camuflaje de variables de entorno.
* **Nodemon:** Sistema de autoreinicio para desarrollo continuo.

---

## 📥 Instalación y Despliegue Táctico

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/OSCARaluceac/Tablon_De_Misiones.git](https://github.com/OSCARaluceac/Tablon_De_Misiones.git)