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

    app.innerHTML = `
    <h1>ElectroLab</h1>
    
    <label for="charge">Carga en microculombios (µC)</label>
    <input id="charge" type="number" value="1" step="any">
    <label for="distance">Distancia en metros</label>
    <input id="distance" type="number" value="1" min="0" step="any">
    <button id="calculate">Calcular</button>
    <p id="result">Potencial electrico: ${potential} V</p>
    <p id ="result">Haz click en el cuadrado para colocar la carga</p>
    <canvas id="simulation" width="600" height="400"></canvas>
    `;

    const pixelPerMeter = 100;
    const canvas = document.querySelector<HTMLCanvasElement>('#simulation');
    const chargeInput = document.querySelector<HTMLInputElement>('#charge');
    const calculateButton = document.querySelector<HTMLButtonElement>('#calculate');
    const result = document.querySelector<HTMLParagraphElement>('#result');
    const distanceInput = document.querySelector<HTMLInputElement>('#distance');
    const pointX = 400;
    const pointY = 200;
    let chargeX = 300;
    let chargeY = 200;
    let chargePlaced = false;
    

    if (canvas === null) {
      throw new Error('No se encuentra el Canvas');
    }

    if (chargeInput === null || calculateButton === null || result === null || distanceInput === null) {
    throw new Error('Faltan elementos')
}

calculateButton.addEventListener('click', () => {
  const chargeMicro = chargeInput.valueAsNumber;

  if(!Number.isFinite(chargeMicro)) {
    result.textContent = 'Introduce una carga';
    return;
  }
  const distance = distanceInput.valueAsNumber;

  if (!Number.isFinite(distance) || distance <= 0) {
    result.textContent = 'Introduce una distancia mayor de cero';
    return;
  }
  const chargeCoulombs = chargeMicro * 1e-6;
  const potential = electric_potential(chargeCoulombs, 0,0,distance,0);

  result.textContent = `Potencial electrico: ${potential} V`
});

const ctx = canvas.getContext('2d');

if (ctx === null) {
  throw new Error('No se puede dibujar en el Canvas')
};

ctx.clearRect(0,0,canvas.width, canvas.height);
ctx.beginPath();

const updateSimulation = () => {
  if (!chargePlaced) {
    return;
  }
  const chargeMicro = chargeInput.valueAsNumber;

  if(!Number.isFinite(chargeMicro)) {
    result.textContent = 'Introduce una carga valida';
    return;
  }



  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.arc(chargeX,chargeY,15,0,Math.PI * 2);
  ctx.fillStyle = chargeMicro < 0 ? '#3b82f6' :'#ef4444';
  ctx.fill();

  const symbol = chargeMicro > 0 ? '+' : chargeMicro < 0 ? '-' : '0'

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, chargeX, chargeY)



  const dx = pointX - chargeX;
  const dy = pointY - chargeY;

  const distanceMeters = Math.hypot(dx,dy) / pixelPerMeter

  distanceInput.value = distanceMeters.toFixed(3)

  ctx.beginPath();
  ctx.arc(pointX, pointY, 6, 0,Math.PI * 2);
  ctx.fillStyle = '#49ee1b'
  ctx.fill()

  try {
    const potential = electric_potential(
      chargeMicro * 1e-6,
      chargeX / pixelPerMeter,
      -chargeY / pixelPerMeter,
      pointX / pixelPerMeter,
      -pointY / pixelPerMeter,
    );

    result.textContent = `Potencial en el punto azul: ${potential.toFixed(2)} V`;
    } catch (error) {
      result.textContent = `Error: ${String(error)}`;
    };
    return;
}


canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();

    const x = (event.clientX - rect.left) * canvas.width / rect.width;
    const y = (event.clientY - rect.top) * canvas.height / rect.height;
  
    chargeX = x
    chargeY = y
    chargePlaced = true;

    updateSimulation()
});

  chargeInput.addEventListener('input', updateSimulation)

}



main().catch((error) => {
    console.error(error);

    if (app !== null) {
        app.textContent = `Error al cargar: ${String(error)}`;
    }
});