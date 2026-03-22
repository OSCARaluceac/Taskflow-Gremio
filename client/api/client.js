// client/src/api/client.js
const API_URL = 'http://localhost:3000/api/v1/tasks';

export const taskAPI = {
    // Obtener todas las misiones (GET)
    async getAll() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al sincronizar con el servidor.');
        return await response.json();
    },

    // Crear una misión completa (POST)
    // Niko, añadimos categoria y rango al envío para que el Gremio tenga la info completa
    async create(title, categoria, rango) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                categoria, 
                rango,
                priority: rango === 'S' ? 5 : 1 // Lógica de prioridad opcional
            })
        });
        if (!response.ok) throw new Error('No se pudo guardar la misión en el servidor.');
        return await response.json();
    },

    // Eliminar una tarea (DELETE)
    // Importante: El ID debe coincidir con el que genera tu backend (String o Number)
    async delete(id) {
        const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE' 
        });
        if (!response.ok) throw new Error('Error al eliminar el registro del servidor.');
        return true;
    }
};