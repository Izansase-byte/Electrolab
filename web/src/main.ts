import './style.css';
import init, { electric_potential } from '../../wasm/pkg/electrolab_wasm.js';

const app = document.querySelector<HTMLDivElement>('#app');

async function main() {
    if (app === null) {
        throw new Error('No se encuentra el elemento #app');
    }

    app.textContent = 'Cargando el motor de física…';

    await init();

    const potential = electric_potential(1e-6, 0, 0, 1, 0);

    app.textContent = `Potencial eléctrico: ${potential} V`;
}

main().catch((error) => {
    console.error(error);

    if (app !== null) {
        app.textContent = `Error al cargar: ${String(error)}`;
    }
});