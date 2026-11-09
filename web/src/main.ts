import './style.css';
import init, { 
  electric_potential,
  total_electric_potential,
  total_electric_field,
 } from '../../wasm/pkg/electrolab_wasm.js';

type SimulationCharge = {
  x: number,
  y: number,
  charge: number,
};

const app = document.querySelector<HTMLDivElement>('#app');

async function main() {
    if (app === null) {
        throw new Error('No se encuentra el elemento #app');
    }

    app.textContent = 'Cargando el motor de física…';

    await init();

    app.innerHTML = `
    <h1>ElectroLab</h1>
    
    <label for="charge">Carga en microculombios (µC)</label>
    <input id="charge" type="number" value="1" step="any">
    <label for="distance">Distancia en metros a la primera carga</label>
    <input id="distance" type="number" value="1" min="0" step="any">
    <button id="calculate">Calcular</button>
    <p id="manual-result">Resultado del calculo manual</p>
    <p>Click para mover la carga | Mayus + click para mover el punto verde</p>
    <p>Escala: 100px = 1m. La flecha indica la direccion del campo.</p>
    <p id ="result">Haz click en el cuadrado para colocar la carga</p>
    <canvas id="simulation" width="600" height="400"></canvas>
    <button id="undo">Deshacer ultima carga</button>
    <button id="clear">Borrar cargas</button>
    
    `;

    const pixelPerMeter = 100;
    const canvas = document.querySelector<HTMLCanvasElement>('#simulation');
    const chargeInput = document.querySelector<HTMLInputElement>('#charge');
    const calculateButton = document.querySelector<HTMLButtonElement>('#calculate');
    const result = document.querySelector<HTMLParagraphElement>('#result');
    const distanceInput = document.querySelector<HTMLInputElement>('#distance');
    const charges: SimulationCharge[] = [];
    const manualResult = document.querySelector<HTMLParagraphElement>('#manual-result');
    const undoButton = document.querySelector<HTMLButtonElement>('#undo')
    let pointX = 400;
    let pointY = 200;
    let chargeX = 300;
    let chargeY = 200;
    let chargePlaced = false;

    if (manualResult === null) {
      throw new Error('No se encuentra el resultado del calculo manual');
    }

    if (canvas === null) {
      throw new Error('No se encuentra el Canvas');
    }

    if (chargeInput === null || calculateButton === null || result === null || distanceInput === null) {
    throw new Error('Faltan elementos')
}

calculateButton.addEventListener('click', () => {
  const chargeMicro = chargeInput.valueAsNumber;

  if(!Number.isFinite(chargeMicro)) {
    manualResult.textContent = 'Introduce una carga';
    return;
  }
  const distance = distanceInput.valueAsNumber;

  if (!Number.isFinite(distance) || distance <= 0) {
    manualResult.textContent = 'Introduce una distancia mayor de cero';
    return;
  }
  const chargeCoulombs = chargeMicro * 1e-6;
  const potential = electric_potential(chargeCoulombs, 0,0,distance,0);

  manualResult.textContent = `Potencial electrico: ${potential} V`
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
  const clearButton = document.querySelector<HTMLButtonElement>('#clear');

  if (clearButton === null) {
    throw new Error('No se ecnuentra el boton de borrar');
  }

  clearButton.addEventListener('click',() => {
    charges.length = 0;
    chargePlaced = false;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    result.textContent = 'Haz click en el recuadro para añadir una carga'


  } )

  ctx.clearRect(0,0, canvas.width, canvas.height);

  for (const item of charges) {
    ctx.beginPath()
    ctx.arc(item.x,item.y,15,0,Math.PI * 2);
    ctx.fillStyle = item.charge < 0 ? '#3b82f6' :'#ef4444';
    ctx.fill();

    const symbol = item.charge > 0 ? '+' : item.charge < 0 ? '-' : '0'

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, item.x, item.y)

  }

  ctx.beginPath();
  ctx.arc(pointX, pointY, 6, 0,Math.PI * 2);
  ctx.fillStyle = '#49ee1b'
  ctx.fill()

  const chargesData = new Float64Array(
    charges.flatMap((item) => [
      item.x / pixelPerMeter,
      -item.y / pixelPerMeter,
      item.charge,
    ]),
  );

  try {

    const potential =total_electric_potential(
      chargesData,
      pointX / pixelPerMeter,
      -pointY / pixelPerMeter,
    );

    const field = total_electric_field(
      chargesData,
      pointX / pixelPerMeter,
      -pointY / pixelPerMeter,
    );


    const ex = field[0];
    const ey = field[1];

    const magnitude = Math.hypot(ex, ey);

    if (magnitude > 0) {
      const arrowLength = 50;

      const endX = pointX + (ex / magnitude) * arrowLength;
      const endY = pointY - (ey / magnitude) * arrowLength;

      ctx.beginPath();
      ctx.moveTo(pointX, pointY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke()

      const angle = Math.atan2(endY - pointY,endX - pointX);
      const headLength = 10;

      ctx.beginPath();
      ctx.moveTo(
        endX - headLength * Math.cos(angle - Math.PI / 6),
        endY - headLength * Math.sin(angle - Math.PI / 6),
      );
      ctx.lineTo(endX, endY);
      ctx.lineTo(
        endX - headLength * Math.cos(angle + Math.PI / 6),
        endY - headLength * Math.sin(angle + Math.PI / 6),
      );
      ctx.stroke();

    }

    const potentialText = Math.abs(potential) < 0.005 ? '0.00' : potential.toFixed(2);

    result.textContent = `Potencial: ${potentialText} V | ` +
    `Ex: ${ex.toFixed(2)} N/C | Ey: ${ey.toFixed(2)} N/C | ` +
    `Campo: ${magnitude.toFixed(2)} N/C`;
    } catch (error) {
      result.textContent = `Error: ${String(error)}`;
    };
    return;
}


canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();

    const x = (event.clientX - rect.left) * canvas.width / rect.width;
    const y = (event.clientY - rect.top) * canvas.height / rect.height;
  
    if (event.shiftKey) {
      pointX = x;
      pointY = y;
    } else {
      chargeX = x;
      chargeY = y;
      chargePlaced = true;

      const chargeMicro = chargeInput.valueAsNumber

      if (!Number.isFinite(chargeMicro)) {
        result.textContent = `Introduce una carga valida`;
        return;
      }

      charges.push ({
        x: chargeX,
        y: chargeY,
        charge: chargeMicro * 1e-6
      });
    }

    updateSimulation()
});

  if (undoButton === null) {
    throw new Error('No se encuentra el boton de deshacer')
    }

  undoButton.addEventListener(`click`, () => {
    charges.pop();
    chargePlaced = charges.length > 0;
  

    if (chargePlaced) {
      updateSimulation();
    } else {
      ctx.clearRect(0,0,canvas.width, canvas.height);
      result.textContent = 'Haz click en el rectangulo para añadir una carga';
    }
      });

}



main().catch((error) => {
    console.error(error);

    if (app !== null) {
        app.textContent = `Error al cargar: ${String(error)}`;
    }
});