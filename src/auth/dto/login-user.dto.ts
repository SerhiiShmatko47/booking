import { ApiProperty } from '@nestjs/swagger'
import { IsPhoneNumber, IsString } from 'class-validator'

export class LoginUserDto {
    @ApiProperty({
        type: String,
        example: '+1234567890',
        description: 'Phone number',
        required: true,
    })
    @IsString()
    @IsPhoneNumber()
    public readonly phone: string

    @ApiProperty({
        type: String,
        example: 'qwerty1234',
        description: 'User password',
        required: true,
    })
    @IsString()
    public readonly password: string
}
