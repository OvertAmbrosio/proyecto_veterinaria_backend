import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from './environment';

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length) {
    const messages = errors
      .map((e) => (e.constraints ? Object.values(e.constraints) : []))
      .flat()
      .join(', ');
    throw new Error(`Config validation error: ${messages}`);
  }
  return validated;
}
