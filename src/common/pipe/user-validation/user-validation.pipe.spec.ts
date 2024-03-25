import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { UserValidationPipe } from './user-validation.pipe'
import { LoginUserDto } from '@auth/dto/login-user.dto'

describe('ValidationPipe', () => {
    let pipe: UserValidationPipe

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserValidationPipe],
        }).compile()

        pipe = module.get<UserValidationPipe>(UserValidationPipe)
    })

    it('should transform a string value', async () => {
        const transformedValue = await pipe.transform('test', {
            metatype: String,
            type: 'body',
        })
        expect(transformedValue).toEqual('test')
    })

    it('should transform an object value', async () => {
        const user = { phone: '+380961111111', password: 'password' }
        const transformedValue = await pipe.transform(user, {
            metatype: LoginUserDto,
            type: 'body',
        })
        expect(transformedValue).toEqual(user)
    })

    it('should throw a BadRequestException when validation fails', async () => {
        const invalidObject = { phone: '+1234567890', password: 'password' }
        await expect(
            pipe.transform(invalidObject, {
                metatype: LoginUserDto,
                type: 'body',
            }),
        ).rejects.toThrowError(BadRequestException)
    })
})
