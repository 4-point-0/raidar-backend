import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class OptionalIntPipe implements PipeTransform<string, Promise<number>> {
  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    if (!value) return null;
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }
    return val;
  }
}
