import { ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { CreateUserPipe } from './create-user.pipe'
import { CreateUserDto } from '../../../users/dto/create-user.dto'

describe('CreateUserPipe', () => {
    let userPipe: CreateUserPipe

    beforeEach(() => {
        userPipe = new CreateUserPipe()
    })

    describe('transform', () => {
        it('should return the value unchanged when metatype is not provided', async () => {
            const value: CreateUserDto = {
                phone: '+380971111111',
                name: 'John',
                password: 'qwerty1234',
            }
            const metadata: ArgumentMetadata = {
                metatype: CreateUserDto,
                type: 'body',
            }
            const result = await userPipe.transform(value, metadata)
            expect(result).toEqual(value)
        })

        it('should throw BadRequestException when the converted object has validation errors', async () => {
            const value: CreateUserDto = {
                phone: '+380971111',
                name: 'John',
                password: 'qwerty1234',
            }
            const metadata: ArgumentMetadata = {
                metatype: CreateUserDto,
                type: 'body',
            }
            await expect(
                userPipe.transform(value, metadata),
            ).rejects.toThrowError(BadRequestException)
        })

        it('should return the value unchanged when the converted object has no validation errors', async () => {
            const value: CreateUserDto = {
                phone: '+380971111111',
                name: 'John',
                password: 'qwerty1234',
            }
            const metadata: ArgumentMetadata = {
                metatype: CreateUserDto,
                type: 'body',
            }
            const result = await userPipe.transform(value, metadata)
            expect(result).toEqual(value)
        })
    })
})
