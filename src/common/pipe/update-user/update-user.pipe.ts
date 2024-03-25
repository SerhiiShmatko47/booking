import { UpdateUserDto } from '@users/dto/update-user.dto'
import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class UpdateUserPipe implements PipeTransform {
    async transform(
        value: UpdateUserDto,
        { type, metatype }: ArgumentMetadata,
    ) {
        if (type !== 'body') return value

        const object = plainToInstance(metatype, value)
        const errors = await validate(object)
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed')
        }
        return value
    }
}
