import { Test, TestingModule } from '@nestjs/testing'
import { ApartmentsController } from './apartments.controller'
import { ApartmentsService } from './apartments.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Apartment } from './entities/apartment.entity'
import { ApartmentsType } from '@common/enums/apartments.enum'
import { User } from '@users/entities/user.entity'
import { CacheModule } from '@nestjs/cache-manager'

describe('ApartmentsController', () => {
    let apartmentsController: ApartmentsController
    let apartmentsService: ApartmentsService

    const mockApartments: Apartment[] = [
        {
            id: '1',
            sequenceNumber: 1,
            isOccupied: true,
            type: ApartmentsType.studio,
            leaseStartDate: new Date(),
            leaseEndDate: new Date(),
            currentOwner: {} as User,
        },
        {
            id: '2',
            sequenceNumber: 2,
            isOccupied: true,
            type: ApartmentsType.fiveBedroom,
            leaseStartDate: new Date(),
            leaseEndDate: new Date(),
            currentOwner: {} as User,
        },
    ]
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CacheModule.register({})],
            controllers: [ApartmentsController],
            providers: [
                ApartmentsService,
                {
                    provide: getRepositoryToken(Apartment),
                    useValue: {
                        find: jest.fn().mockReturnValue(mockApartments),
                        findOne: jest.fn().mockReturnValue(mockApartments[0]),
                        create: jest.fn().mockReturnValue(mockApartments[0]),
                        save: jest.fn().mockReturnValue(mockApartments[0]),
                        update: jest.fn().mockReturnValue(mockApartments[0]),
                        delete: jest.fn().mockReturnValue(mockApartments[0]),
                    },
                },
            ],
        }).compile()

        apartmentsController =
            module.get<ApartmentsController>(ApartmentsController)
        apartmentsService = module.get<ApartmentsService>(ApartmentsService)
    })

    describe('findAll', () => {
        it('should return all apartments when given valid take and skip parameters', async () => {
            expect(await apartmentsController.findAll(0, 10)).toEqual(
                mockApartments,
            )
        })

        it('should return an empty array when given invalid take and skip parameters', async () => {
            jest.spyOn(apartmentsService, 'findAll').mockResolvedValue([])
            expect(await apartmentsController.findAll(-1, -1)).toEqual([])
        })

        it('should return an empty array when there are no apartments in the database', async () => {
            jest.spyOn(apartmentsService, 'findAll').mockResolvedValue([])
            expect(await apartmentsController.findAll(0, 10)).toEqual([])
        })
    })

    describe('findOne', () => {
        it('should return an apartment when a valid id is provided', async () => {
            const apartmentId = 'validId'
            jest.spyOn(apartmentsService, 'findOne').mockResolvedValue(
                mockApartments[0],
            )

            expect(await apartmentsController.findOne(apartmentId)).toEqual(
                mockApartments[0],
            )
        })

        it('should return null when an empty id is provided', async () => {
            const apartmentId = ''
            const apartment = null
            jest.spyOn(apartmentsService, 'findOne').mockResolvedValue(
                apartment,
            )

            expect(await apartmentsController.findOne(apartmentId)).toBeNull()
        })
    })
})
