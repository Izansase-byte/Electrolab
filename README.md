# Electrolab

An interactive electrical simulator built with rust,webAssembly and TypeScript.

Place electric charges on a canvas and explore how they affect the electric potential and field at a measuring point.

## Features

- Add positve,negative or neutral charges.
- Calculate the total electric potential and field from multiple charges.
- Display the field components and magnitude.
- Show the field components and magnitude.
- Move the measuring point
- Clear all charges and restart again.
- Calculate the potential of a single charge using a manual charge and distance input

## What I used

- **Rust** for the physics calculations.
- **WebAssembly and wasm-bingen** to use rust from the browser.
- **TypeScript** for the interface and user interactions.
- **HTML Canvas** for drawing charges and the field arrow.
- **Vite** for development builds.

## Requirements

- Rust and Cargo
- Node.js LTS and npm
- wasm-pack
- The Rust WebAssembly target

Install the WebAssembly tools with:

```bash
rustup target add wasm32-unknown-unknown
cargo install wasm-pack --locked
```

## Run locally

From the project root, build the WebAssembly package:

```bash
wasm-pack build wasm --target web
```

Install dependencies and start Vite:

```bash
cd web
npm install
npm run dev
```

Open the local address shown in the terminal.

After changing the Rust code, rebuild the WebAssembly package from the project root.

## Physics

The library includes:

- Vector addition, subtraction, scaling, normalization, magnitude and distance.
- Coulomb force between two charges.
- Total force on a target charge.
- Electric field and potential from a point charge.
- Total electric field and potential from multiple charges.

