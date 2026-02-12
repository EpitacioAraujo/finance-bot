/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { validate as CVValidator } from 'class-validator';

export abstract class BaseClassValidatorDto {
  static async validate(dto: any): Promise<string[] | null> {
    const result = await CVValidator(dto);

    if (result.length > 0) {
      const errors: string[] = [];

      result.forEach((error) => {
        if (error.constraints) {
          errors.push(Object.values(error.constraints)[0]);
        }
      });

      return errors;
    }

    return null;
  }
}
