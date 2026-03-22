/**
 * TASKFLOW - Sistema de Gestión de Misiones (Fullstack Edition)
 * Fuente de verdad: Servidor Node.js
 */
import { taskAPI } from './api/client.js';

// --- 1. ESTADO GLOBAL ---
let listaMisiones = []; 
const filtrosRango = new Set(['D', 'C', 'B', 'A', 'S']);
const filtrosCategoria = new Set(['Recolección', 'Exploración', 'Captura', 'Escolta', 'Caza']);
let ordenActivo = false;

// --- 2. GESTIÓN DE INTERFAZ (UI STATES) ---
const loadingEl = document.getElementById('loading-state');
const errorEl = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

function toggleLoading(show) {
    if (loadingEl) loadingEl.classList.toggle('hidden', !show);
}

function showErrorMessage(message) {
    if (!errorEl || !errorText) return;
    errorText.innerText = message;
    errorEl.classList.remove('hidden');
    setTimeout(() => errorEl.classList.add('hidden'), 5000);
}

// --- 3. OPERACIONES ASÍNCRONAS (CONEXIÓN BACKEND) ---

async function loadTasks() {
    toggleLoading(true);
    try {
        listaMisiones = await taskAPI.getAll();
        render();
    } catch (error) {
        showErrorMessage("Fallo de sincronización con el Gremio.");
    } finally {
        toggleLoading(false);
    }
}

async function agregarMision(title, categoria, rango) {
    toggleLoading(true);
    try {
        const nueva = await taskAPI.create(title, categoria, rango);
        listaMisiones.push(nueva);
        render();
    } catch (error) {
        showErrorMessage("No se pudo publicar el contrato.");
    } finally {
        toggleLoading(false);
    }
}

// ACTUALIZACIÓN NECESARIA: Persistencia del toggle
window.toggleMision = async (id) => {
    const mision = listaMisiones.find(m => m.id === id);
    if (!mision) return;

    const nuevoEstado = !mision.completed;
    toggleLoading(true);
    
    try {
        // Enviamos la actualización al servidor mediante PATCH
        await taskAPI.updateStatus(id, nuevoEstado);
        mision.completed = nuevoEstado;
        render();
    } catch (error) {
        showErrorMessage("Error al sincronizar el estado con el servidor.");
    } finally {
        toggleLoading(false);
    }
};

window.eliminarMision = async (id) => {
    if (!confirm("¿Deseas retirar este encargo del tablón?")) return;
    toggleLoading(true);
    try {
        await taskAPI.delete(id);
        listaMisiones = listaMisiones.filter(m => m.id !== id);
        render();
    } catch (error) {
        showErrorMessage("No se pudo eliminar la misión del servidor.");
    } finally {
        toggleLoading(false);
    }
};

// --- 4. MOTOR DE RENDERIZADO ---

function render() {
    const contenedor = document.getElementById('lista-misiones');
    const busqueda = document.getElementById('filtro-texto')?.value.toLowerCase() || "";
    const filtroEstado = document.getElementById('filtro-estado')?.value || "todas";
    
    if (!contenedor) return;
    contenedor.innerHTML = '';

    let misionesParaMostrar = [...listaMisiones]; 
    
    if (ordenActivo) {
        const p = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
        misionesParaMostrar.sort((a, b) => (p[b.rango] || 0) - (p[a.rango] || 0));
    } else {
        misionesParaMostrar.sort((a, b) => b.id - a.id); 
    }

    misionesParaMostrar.forEach(mision => {
        const cumpleFiltros = filtrosRango.has(mision.rango) && 
                              filtrosCategoria.has(mision.categoria);
        const cumpleBusqueda = mision.title.toLowerCase().includes(busqueda);
        const cumpleEstado = filtroEstado === 'todas' || 
                            (filtroEstado === 'completadas' && mision.completed) || 
                            (filtroEstado === 'pendientes' && !mision.completed);

        if (cumpleFiltros && cumpleBusqueda && cumpleEstado) {
            contenedor.appendChild(crearMisionElemento(mision));
        }
    });

    actualizarEstadisticas();
    actualizarEstiloBotonOrdenar();
}

function crearMisionElemento(mision) {
    const el = document.createElement('div');
    const completada = mision.completed;
    el.className = `p-5 border relative hover:scale-[1.01] transition-all duration-300 flex justify-between items-center group 
        ${completada ? 'opacity-60 bg-stone-100 dark:bg-zinc-800/50 border-stone-400' : 'bg-white dark:bg-zinc-800 border-stone-200 ring-1 ring-gold/20'}`;
    
    el.innerHTML = `
        <div class="relative z-10 flex-1 ${completada ? 'line-through decoration-gold' : ''}">
            <span class="font-pixel text-[8px] text-gold uppercase tracking-tighter">
                ${mision.categoria} | RANGO ${mision.rango}
            </span>
            <p class="text-lg font-bold text-stone-800 dark:text-stone-100 mt-1">${mision.title}</p>
        </div>
        <div class="flex gap-2 relative z-20 ml-4">
            <button onclick="window.toggleMision('${mision.id}')" class="px-3 py-2 border border-gold text-gold hover:bg-gold hover:text-white transition-all font-pixel text-[8px]">
                ${completada ? '↩' : '✓'}
            </button>
            <button onclick="window.eliminarMision('${mision.id}')" class="bg-red-500/10 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-3 py-2 font-pixel text-[8px] transition-all">
                X
            </button>
        </div>
    `;
    return el;
}

// --- 5. ESTADÍSTICAS Y SISTEMAS SECUNDARIOS ---

function actualizarEstadisticas() {
    const total = listaMisiones.length;
    const completadas = listaMisiones.filter(m => m.completed).length;
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
    const statsContainer = document.getElementById('stats-container');
    
    if (statsContainer) {
        statsContainer.innerHTML = `
            <p class="flex justify-between">TOTAL: <span class="text-gold">${total}</span></p>
            <p class="flex justify-between text-blue-600">PENDIENTES: <span>${total - completadas}</span></p>
            <p class="flex justify-between text-green-600">LOGRADAS: <span>${completadas}</span></p>
            <div class="mt-4">
                <div class="flex justify-between font-pixel text-[8px] mb-1 text-stone-500">
                    <span>PROGRESO</span><span>${porcentaje}%</span>
                </div>
                <div class="w-full h-2 bg-stone-200 dark:bg-zinc-700 rounded overflow-hidden">
                    <div class="h-full bg-gold transition-all duration-700" style="width: ${porcentaje}%"></div>
                </div>
            </div>
        `;
    }
}

function setupFiltros() {
    const rCont = document.getElementById('filtro-rangos');
    const cCont = document.getElementById('filtro-categorias');
    if (!rCont || !cCont) return;

    const crearBtn = (texto, set, tipo) => {
        const btn = document.createElement('button');
        btn.textContent = texto;
        btn.onclick = () => {
            set.has(texto) ? set.delete(texto) : set.add(texto);
            btn.className = getEstiloFiltro(set.has(texto), tipo);
            render();
        };
        btn.className = getEstiloFiltro(set.has(texto), tipo);
        return btn;
    };

    ['D', 'C', 'B', 'A', 'S'].forEach(r => rCont.appendChild(crearBtn(r, filtrosRango, 'rango')));
    ['Recolección', 'Exploración', 'Captura', 'Escolta', 'Caza'].forEach(c => cCont.appendChild(crearBtn(c, filtrosCategoria, 'cat')));
}

function getEstiloFiltro(activo, tipo) {
    if (tipo === 'rango') {
        return `w-10 h-10 font-pixel text-[10px] border transition-all ${activo ? 'bg-gold text-white border-gold' : 'text-stone-400 border-stone-400 opacity-40'}`;
    }
    return `text-left p-2 font-pixel text-[9px] border-l-4 transition-all ${activo ? 'border-gold text-gold bg-gold/5' : 'border-transparent text-stone-400 opacity-40'}`;
}

function setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const apply = (t) => {
        document.documentElement.classList.toggle('dark', t === 'dark');
        localStorage.setItem('task_theme', t);
    };
    themeToggle?.addEventListener('click', () => apply(document.documentElement.classList.contains('dark') ? 'light' : 'dark'));
    apply(localStorage.getItem('task_theme') || 'light');
}

function actualizarEstiloBotonOrdenar() {
    const btn = document.getElementById('btn-ordenar');
    if (btn) btn.classList.toggle('boton-rango-s', ordenActivo);
}

window.ordenarPorPrioridad = () => {
    ordenActivo = !ordenActivo;
    render();
};

// --- 6. INICIALIZACIÓN ---

const formMision = document.getElementById('form-mision');
formMision?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('input-mision').value.trim();
    const categoria = document.getElementById('select-categoria').value;
    const rango = document.getElementById('select-rango').value;
    if (title.length >= 3) {
        await agregarMision(title, categoria, rango);
        e.target.reset();
    }
});

document.getElementById('filtro-texto')?.addEventListener('input', render);
document.getElementById('filtro-estado')?.addEventListener('change', render);

document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    setupFiltros();
    loadTasks();
});