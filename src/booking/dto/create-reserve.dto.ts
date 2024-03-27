import { ApiProperty } from '@nestjs/swagger'
import { IsDate } from 'class-validator'

export class CreateReservationDto {
    @ApiProperty({
        example: '2021-09-01T00:00:00.000Z',
        description: 'The start of the booking',
        type: Date,
    })
    @IsDate()
    public readonly start: Date

    @ApiProperty({
        example: '2021-09-01T00:00:00.000Z',
        description: 'The end of the booking',
        type: Date,
    })
    @IsDate()
    public readonly end: Date
}
