import { ApartmentsType } from '@common/enums/apartments.enum'
import { ApiProperty } from '@nestjs/swagger'

export class CreateApartmentDto {
    @ApiProperty({
        example: 1,
        description: 'The number of the apartment',
        type: Number,
    })
    public readonly sequenceNumber: number

    @ApiProperty({
        example: true,
        description: 'Whether the apartment is occupied',
        type: Boolean,
    })
    public readonly isOccupied: boolean

    @ApiProperty({
        example: 'studio',
        description: 'The type of the apartment',
        enum: Object.values(ApartmentsType),
    })
    public readonly apartmentsType: ApartmentsType
}
