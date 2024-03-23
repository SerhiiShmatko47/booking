import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common'

@Injectable()
export class GetUsersPipe implements PipeTransform {
    transform(value: unknown, metadata: ArgumentMetadata) {
        if (metadata.type !== 'query') return value
        if (typeof value !== 'number')
            throw new BadRequestException('Value must be a number')
        return value
    }
}
