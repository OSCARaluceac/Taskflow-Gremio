/**
 * API CLIENT - TASKFLOW (Rango S)
 * Gestiona la comunicación asíncrona con el servidor de Node.js.
 */

// Detección inteligente de punto de enlace
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api/v1/tasks' 
    : '/api/v1/tasks';

export const taskAPI = {
    /**
     * Sincroniza todas las misiones registradas.
     */
    async getAll() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al sincronizar con el servidor.');
        return await response.json();
    },

    /**
     * Registra una nueva misión en el servidor central.
     */
    async create(title, categoria, rango) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                categoria, 
                rango,
                priority: rango === 'S' ? 5 : 1 // Jerarquía de importancia
            })
        });
        if (!response.ok) throw new Error('No se pudo guardar la misión en el servidor.');
        return await response.json();
    },

    /**
     * Actualiza el estado de cumplimiento de una misión (Fase 3).
     */
    async updateStatus(id, completed) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH', // Actualización parcial del recurso
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        if (!response.ok) throw new Error('Fallo al actualizar el estado en el servidor.');
        return await response.json();
    },

    /**
     * Elimina permanentemente una misión del registro.
     */
    async delete(id) {
        const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE' 
        });
        if (!response.ok) throw new Error('Error al eliminar el registro del servidor.');
        return true;
    }
};