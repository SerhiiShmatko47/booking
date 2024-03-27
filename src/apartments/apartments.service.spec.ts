import { Test, TestingModule } from '@nestjs/testing'
import { ApartmentsService } from './apartments.service'
import { Apartment } from './entities/apartment.entity'
import { ApartmentsType } from '@common/enums/apartments.enum'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CreateApartmentDto } from './dto/create-apartment.dto'
import { BadRequestException } from '@nestjs/common'
import { DeleteResult, Repository } from 'typeorm'

describe('ApartmentsService', () => {
    let apartmentsService: ApartmentsService
    let apartmentsRepository: Repository<Apartment>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ApartmentsService,
                {
                    provide: getRepositoryToken(Apartment),
                    useClass: Repository,
                },
            ],
        }).compile()

        apartmentsService = module.get<ApartmentsService>(ApartmentsService)
        apartmentsRepository = module.get<Repository<Apartment>>(
            getRepositoryToken(Apartment),
        )
    })

    describe('create', () => {
        it('should create a new apartment when one with the same sequence number does not exist', async () => {
            const createApartmentDto: CreateApartmentDto = {
                sequenceNumber: 1,
                isOccupied: false,
                apartmentsType: ApartmentsType.studio,
            }
            jest.spyOn(apartmentsRepository, 'findOne').mockReturnValue(
                undefined,
            )
            jest.spyOn(apartmentsRepository, 'create').mockResolvedValue(
                new Apartment() as never,
            )
            jest.spyOn(apartmentsRepository, 'save').mockResolvedValue(
                new Apartment(),
            )
            const result = await apartmentsService.create(createApartmentDto)
            expect(result.message).toEqual('Apartment created successfully')
        })

        it('should throw a BadRequestException when an apartment with the same sequence number already exists', async () => {
            const createApartmentDto: CreateApartmentDto = {
                sequenceNumber: 1,
                isOccupied: false,
                apartmentsType: ApartmentsType.studio,
            }
            jest.spyOn(apartmentsRepository, 'findOne').mockReturnValue(
                {} as Promise<Apartment>,
            )
            await expect(
                apartmentsService.create(createApartmentDto),
            ).rejects.toThrow(BadRequestException)
        })
    })

    describe('findAll', () => {
        it('should return all apartments', async () => {
            const take = 10
            const skip = 0
            jest.spyOn(apartmentsRepository, 'find').mockResolvedValue([
                new Apartment() as never,
            ] as never)
            const result = await apartmentsService.findAll(take, skip)
            expect(result).toEqual([new Apartment()])
        })

        it('should return an empty array when there are no apartments in the database', async () => {
            const take = 10
            const skip = 0
            jest.spyOn(apartmentsRepository, 'find').mockResolvedValue([])
            const result = await apartmentsService.findAll(take, skip)
            expect(result).toEqual([])
        })

        it('should return an array of apartments with pagination', async () => {
            const take = 10
            const skip = 0
            jest.spyOn(apartmentsRepository, 'find').mockResolvedValue([
                new Apartment() as never,
            ] as never)
            const result = await apartmentsService.findAll(take, skip)
            expect(result).toEqual([new Apartment()])
        })
    })

    describe('findOne', () => {
        it('should return the apartment with the given ID', async () => {
            const id = '1'
            jest.spyOn(apartmentsRepository, 'findOne').mockResolvedValue(
                new Apartment() as never,
            )
            const result = await apartmentsService.findOne(id)
            expect(result).toEqual(new Apartment())
        })
    })

    describe('update', () => {
        it('should update the apartment with the given ID', async () => {
            const id = '1'
            const updateApartmentDto: CreateApartmentDto = {
                sequenceNumber: 1,
                isOccupied: false,
                apartmentsType: ApartmentsType.studio,
            }
            jest.spyOn(apartmentsRepository, 'findOne').mockResolvedValue(
                new Apartment() as never,
            )
            jest.spyOn(apartmentsRepository, 'update').mockResolvedValue(
                new Apartment() as never,
            )
            const result = await apartmentsService.update(
                id,
                updateApartmentDto,
            )
            expect(result).toEqual({
                message: 'Apartment updated successfully',
            })
        })

        it('should throw a BadRequestException when the apartment does not exist', async () => {
            const id = '1'
            const updateApartmentDto: CreateApartmentDto = {
                sequenceNumber: 1,
                isOccupied: false,
                apartmentsType: ApartmentsType.studio,
            }
            jest.spyOn(apartmentsRepository, 'findOne').mockResolvedValue(null)
            await expect(
                apartmentsService.update(id, updateApartmentDto),
            ).rejects.toThrow(BadRequestException)
        })
    })

    describe('remove', () => {
        it('should remove the apartment with the given ID', async () => {
            const id = '1'
            jest.spyOn(apartmentsRepository, 'findOne').mockResolvedValue(
                new Apartment() as never,
            )
            jest.spyOn(apartmentsRepository, 'delete').mockResolvedValue(
                new DeleteResult() as never,
            )
            const result = await apartmentsService.remove(id)
            expect(result).toEqual({
                message: 'Apartment removed successfully',
            })
        })

        it('should throw a BadRequestException when the apartment does not exist', async () => {
            const id = '1'
            jest.spyOn(apartmentsRepository, 'findOne').mockResolvedValue(null)
            await expect(apartmentsService.remove(id)).rejects.toThrow(
                BadRequestException,
            )
        })
    })
})
