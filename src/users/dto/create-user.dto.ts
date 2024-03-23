import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({
        type: String,
        example: '+1234567890',
        description: 'Phone number',
        required: true,
    })
    public readonly phone: string

    @ApiProperty({
        type: String,
        example: 'John',
        description: 'User name',
        required: true,
    })
    public readonly name: string

    @ApiProperty({
        type: String,
        example: 'qwerty1234',
        description: 'User password',
        required: true,
    })
    public readonly password: string
}
