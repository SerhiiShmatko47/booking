import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class UserValidationPipe implements PipeTransform {
    async transform(value: unknown, { metatype }: ArgumentMetadata) {
        if (!metatype || metatype === String) {
            return value
        }
        const object = plainToInstance(metatype, value)
        const errors = await validate(object)
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed')
        }
        return value
    }
}
