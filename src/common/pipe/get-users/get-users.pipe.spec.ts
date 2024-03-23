import { ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { GetUsersPipe } from './get-users.pipe'

describe('GetUsersPipe', () => {
    let getPipe: GetUsersPipe

    beforeEach(() => {
        getPipe = new GetUsersPipe()
    })
    it('should return the input value when metadata type is not "query"', () => {
        const value = 123
        const metadata: ArgumentMetadata = { type: 'body' }
        expect(getPipe.transform(value, metadata)).toBe(value)
    })

    it('should throw a BadRequestException when value is not a number', () => {
        const value = 'abc'
        const metadata: ArgumentMetadata = { type: 'query' }
        expect(() => getPipe.transform(value, metadata)).toThrow(
            BadRequestException,
        )
    })

    it('should return the input value when value is a number', () => {
        const value = 123
        const metadata: ArgumentMetadata = { type: 'query', metatype: Number }
        expect(getPipe.transform(value, metadata)).toBe(value)
    })
})
