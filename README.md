# ManualJ

A TypeScript library for whole-home manual-j-style heat load calculations for winter heating conditions.

## Description

This library aims to provide tools and calculations based on ACCA Manual J residential load calculations. Currently supported is winter heating conditions against a whole home. This can be helpful to predict what a house's winter heating cost might be.

This library is based on an older (7th edition) version of the Manual J and is not appropriate for environments where accuracy is critical.

## Installation

```bash
npm install manualj
```

## Usage

See [Expected Usage](tests/expectedUsage.test.ts) for a complete example.

```typescript
  import { House, Climate } from "manualj";

  const house = new House();
  const climate = new Climate();

  climate.state = "ONTARIO";
  climate.location = "Ottawa AP (S)";

  house.wall.cavityInsulation = "R-19";
  house.wall.area = 1078;

  const indoorTemperature = 70;
  console.log(house.calculateHeatLoss(indoorTemperature - climate.winterDesignTemperature));
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.