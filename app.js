// --- ESTADO ---
let misiones = JSON.parse(localStorage.getItem('taskflow_misiones')) || [];
let rangosActivos = new Set(['D', 'C', 'B', 'A', 'S']);
let categoriasActivas = new Set(['Recolección', 'Exploración', 'Captura', 'Escolta', 'Caza']);

// --- MODO OSCURO ---
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('task_theme', theme);
}
themeToggle.addEventListener('click', () => {
    applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
});
applyTheme(localStorage.getItem('task_theme') || 'light');

// --- NUEVO: ESTADÍSTICAS ---
function actualizarEstadisticas() {
    const total = misiones.length;
    const completadas = misiones.filter(m => m.completada).length;
    const pendientes = total - completadas;

    document.getElementById('stats-container').innerHTML = `
        <p class="flex justify-between">TOTAL: <span class="text-stone-800 dark:text-gold">${total}</span></p>
        <p class="flex justify-between text-blue-600">PENDIENTES: <span>${pendientes}</span></p>
        <p class="flex justify-between text-green-600">LOGRADAS: <span>${completadas}</span></p>
    `;
}

// --- RENDERIZADO ACTUALIZADO ---
function render() {
    const list = document.getElementById('lista-misiones');
    const busqueda = document.getElementById('filtro-texto').value.toLowerCase();
    const filtroEstado = document.getElementById('filtro-estado').value;
    list.innerHTML = '';

    misiones.forEach(m => {
        const cumpleFiltros = rangosActivos.has(m.rango) && 
                            categoriasActivas.has(m.categoria) && 
                            m.texto.toLowerCase().includes(busqueda);
        
        const cumpleEstado = filtroEstado === 'todas' || 
                            (filtroEstado === 'completadas' && m.completada) || 
                            (filtroEstado === 'pendientes' && !m.completada);

        if (cumpleFiltros && cumpleEstado) {
            const el = document.createElement('div');
            
            // Estilo dinámico si está completada
            const clasesCompletada = m.completada 
                ? 'opacity-60 grayscale-[0.5] border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-zinc-800/50' 
                : 'bg-white dark:bg-zinc-800 border-stone-200 dark:border-stone-700 ring-1 ring-gold/20';

            el.className = `p-5 border relative hover:scale-[1.01] transition-all duration-300 flex justify-between items-center group overflow-hidden ${clasesCompletada}`;
            
            el.innerHTML = `
                <div class="relative z-10 ${m.completada ? 'line-through decoration-gold' : ''}">
                    <span class="font-pixel text-[8px] text-gold dark:text-gold/80 uppercase tracking-tighter">${m.categoria} | RANGO ${m.rango}</span>
                    <p class="text-lg font-bold text-stone-800 dark:text-stone-100 mt-1">${m.texto}</p>
                </div>
                <div class="flex gap-2 relative z-20">
                    <button onclick="toggleMision(${m.id})" 
                        class="px-3 py-2 border border-gold text-gold hover:bg-gold hover:text-white transition-all font-pixel text-[8px]">
                        ${m.completada ? '↩' : '✓'}
                    </button>
                    <button onclick="eliminar(${m.id})" 
                        class="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 font-pixel text-[8px] transition-all">
                        X
                    </button>
                </div>
            `;
            list.appendChild(el);
        }
    });
    actualizarEstadisticas();
}

// --- ACCIONES ---
document.getElementById('form-mision').onsubmit = (e) => {
    e.preventDefault();
    misiones.push({
        id: Date.now(),
        texto: document.getElementById('input-mision').value,
        categoria: document.getElementById('select-categoria').value,
        rango: document.getElementById('select-rango').value,
        completada: false, // Requisito del ejercicio
        fecha: new Date().toLocaleDateString() // Requisito extra
    });
    guardarYRender();
    e.target.reset();
};

window.toggleMision = (id) => {
    const mision = misiones.find(m => m.id === id);
    if (mision) {
        mision.completada = !mision.completada;
        guardarYRender();
    }
};

window.eliminar = (id) => {
    misiones = misiones.filter(m => m.id !== id);
    guardarYRender();
};

function guardarYRender() {
    localStorage.setItem('taskflow_misiones', JSON.stringify(misiones));
    render();
}

// --- INICIALIZACIÓN ---
function init() {
    // Filtros de Rango
    const rCont = document.getElementById('filtro-rangos');
    rCont.innerHTML = '';
    ['D', 'C', 'B', 'A', 'S'].forEach(r => {
        const btn = document.createElement('button');
        btn.textContent = r;
        btn.className = `w-10 h-10 font-pixel text-[10px] border transition-all duration-300 ${rangosActivos.has(r) ? 'bg-wood text-white dark:bg-gold border-wood dark:border-gold' : 'text-stone-400 border-stone-300 dark:border-stone-700'}`;
        btn.onclick = () => {
            rangosActivos.has(r) ? rangosActivos.delete(r) : rangosActivos.add(r);
            init();
        };
        rCont.appendChild(btn);
    });

    // Filtros de Categoría
    const cCont = document.getElementById('filtro-categorias');
    cCont.innerHTML = '';
    ['Recolección', 'Exploración', 'Captura', 'Escolta', 'Caza'].forEach(c => {
        const btn = document.createElement('button');
        btn.textContent = c;
        btn.className = `text-left p-2 font-pixel text-[9px] transition-all duration-300 border-l-4 ${categoriasActivas.has(c) ? 'border-gold text-stone-800 dark:text-stone-100 bg-gold/5' : 'border-transparent text-stone-400 opacity-50'}`;
        btn.onclick = () => {
            categoriasActivas.has(c) ? categoriasActivas.delete(c) : categoriasActivas.add(c);
            init();
        };
        cCont.appendChild(btn);
    });
    render();
}

document.getElementById('filtro-texto').oninput = render;
document.getElementById('filtro-estado').onchange = render;
document.addEventListener('DOMContentLoaded', init);
