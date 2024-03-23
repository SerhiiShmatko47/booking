import { ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { UpdateUserDto } from '../../../users/dto/update-user.dto'
import { UpdateUserPipe } from './update-user.pipe'

describe('transform', () => {
    let updatePipe: UpdateUserPipe
    beforeEach(() => {
        updatePipe = new UpdateUserPipe()
    })
    it('should pass validation and return the value for valid input', async () => {
        const value: UpdateUserDto = {
            phone: '+380971111111',
        }
        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: UpdateUserDto,
        }
        const result = await updatePipe.transform(value, metadata)
        expect(result).toEqual(value)
    })

    it('should throw BadRequestException for input with validation errors', async () => {
        const value: UpdateUserDto = {
            phone: '11111',
        }
        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: UpdateUserDto,
        }
        await expect(updatePipe.transform(value, metadata)).rejects.toThrow(
            BadRequestException,
        )
    })
})
