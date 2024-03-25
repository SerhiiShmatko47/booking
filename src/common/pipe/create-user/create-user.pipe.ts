import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common'
import { CreateUserDto } from '@users/dto/create-user.dto'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class CreateUserPipe implements PipeTransform {
    async transform(value: CreateUserDto, { metatype }: ArgumentMetadata) {
        if (!metatype) {
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
