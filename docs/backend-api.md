# Documentación Técnica - API TaskFlow

En la Fase 3 de TaskFlow, hemos migrado de una persistencia local a una arquitectura de servidor. Para garantizar la escalabilidad y robustez, nos apoyamos en las siguientes herramientas:

## 1. Axios
**¿Qué es?** Una librería cliente HTTP basada en promesas para el navegador y Node.js.
**¿Por qué se usa?** * Transforma automáticamente los datos a JSON.
* Permite interceptar peticiones y respuestas (útil para añadir tokens de seguridad en el futuro).
* Maneja de forma mucho más limpia los errores de red que la API `fetch` nativa.

## 2. Postman / Thunder Client
**¿Qué es?** Herramientas para testear APIs sin necesidad de tener un frontend construido.
**¿Por qué se usa?** * Permite verificar que los endpoints (GET, POST, DELETE) devuelven los códigos de estado correctos (201, 400, 404).
* Facilita la creación de "colecciones" para documentar cómo deben ser los objetos JSON que el backend espera recibir.

## 3. Sentry
**¿Qué es?** Una plataforma de monitoreo de errores y rendimiento en tiempo real.
**¿Por qué se usa?** * Si el servidor falla en producción, Sentry captura el error exacto (stack trace) y nos avisa.
* Permite ver qué usuario y qué acción causó el fallo antes de que el cliente lo reporte.

## 4. Swagger (OpenAPI)
**¿Qué es?** El estándar de la industria para documentar el diseño de APIs RESTful.
**¿Por qué se usa?** * Genera una página web interactiva donde cualquier desarrollador puede ver qué rutas existen y probarlas directamente.
* Define el "contrato" de la API: qué campos son obligatorios y de qué tipo (String, Number, etc.).