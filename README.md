# ManualJ

A TypeScript library for whole-home manual-j-style heat load calculations.

## Description

This library aims to provide tools and calculations based on ACCA Manual J (8th Edition) principles for determining residential heating and cooling loads.

## Installation

```bash
npm install manualj
```

## Usage

```typescript
import { calculateRoomHeatLoad } from 'manualj';

const livingRoomLoad = calculateRoomHeatLoad("Living Room");
console.log(livingRoomLoad); // Output: Heat load for Living Room is X BTU/hr.
```

## Features (Planned)

*   Calculation of sensible and latent heat gains/losses.
*   Window, door, wall, roof, and floor load calculations.
*   Infiltration and ventilation load calculations.
*   Duct system gain/loss considerations.
*   Detailed reporting.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE:1) file for details.