import { Transform } from 'class-transformer';

export function ToUpperCase() {
  return Transform(({ value }) => {
    return typeof value === 'string' ? value.toUpperCase() : value;
  });
}
