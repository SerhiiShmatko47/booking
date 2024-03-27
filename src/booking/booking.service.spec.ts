import { Test, TestingModule } from '@nestjs/testing'
import { BookingService } from './booking.service'
import { ApartmentsService } from '@apartments/apartments.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Apartment } from '@apartments/entities/apartment.entity'
import { User } from '@users/entities/user.entity'
import { BadRequestException } from '@nestjs/common'

describe('BookingService', () => {
    let bookingService: BookingService
    let apartmentsRepository: Repository<Apartment>
    let usersRepository: Repository<User>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingService,
                ApartmentsService,
                {
                    provide: getRepositoryToken(Apartment),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile()

        bookingService = module.get<BookingService>(BookingService)
        apartmentsRepository = module.get<Repository<Apartment>>(
            getRepositoryToken(Apartment),
        )
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User))
    })

    describe('reserve', () => {
        it('should throw a BadRequestException if the apartment is already occupied', async () => {
            const apartmentId = '1'
            const userId = '1'
            const start = new Date()
            const end = new Date()

            jest.spyOn(
                bookingService as any,
                'isUserAndApartmentExists',
            ).mockResolvedValueOnce([{ isOccupied: true }, {}])

            await expect(
                bookingService.reserve(apartmentId, userId, start, end),
            ).rejects.toThrow(BadRequestException)
        })

        it('should throw a BadRequestException if the date range is invalid', async () => {
            const apartmentId = '1'
            const userId = '1'
            const start = new Date()
            const end = new Date(start.getTime() - 1)

            jest.spyOn(
                bookingService as any,
                'isUserAndApartmentExists',
            ).mockResolvedValueOnce([{ isOccupied: false }, {}])

            await expect(
                bookingService.reserve(apartmentId, userId, start, end),
            ).rejects.toThrow(BadRequestException)
        })

        it('should set the current owner, lease start date, lease end date, and occupancy status correctly', async () => {
            const apartmentId = '1'
            const userId = '1'
            const start = new Date()
            const end = new Date(start.getTime() + 1)

            const apartment = new Apartment()
            const user = new User()
            user.apartments = []

            jest.spyOn(
                bookingService as any,
                'isUserAndApartmentExists',
            ).mockResolvedValueOnce([apartment, user])
            jest.spyOn(
                bookingService as any,
                'saveApartmentAndUserWithTransaction',
            ).mockReturnValue({})
            await bookingService.reserve(apartmentId, userId, start, end)

            expect(apartment.currentOwner).toBe(user)
            expect(apartment.leaseStartDate).toBe(start)
            expect(apartment.leaseEndDate).toBe(end)
            expect(apartment.isOccupied).toBe(true)
        })
    })

    describe('unreserve', () => {
        it('should unreserve an apartment for a user', async () => {
            const apartmentId = '1'
            const userId = '1'

            const apartment = new Apartment()
            const user = new User()
            user.apartments = [apartment]
            user.id = userId
            apartment.id = apartmentId
            apartment.isOccupied = true
            apartment.currentOwner = user

            jest.spyOn(apartmentsRepository, 'findOne').mockResolvedValue(
                apartment,
            )
            jest.spyOn(user.apartments, 'filter').mockReturnValue([])
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user)
            jest.spyOn(
                bookingService as any,
                'saveApartmentAndUserWithTransaction',
            ).mockReturnValue({})

            const result = await bookingService.unreserve(apartmentId, userId)

            expect(result).toEqual({
                message: 'Apartment unreserved successfully',
            })
        })

        it('should throw BadRequestException if apartment is not reserved', async () => {
            const apartmentId = '1'
            const userId = '1'
            jest.spyOn(
                bookingService as any,
                'isUserAndApartmentExists',
            ).mockResolvedValueOnce([{ isOccupied: false }, { id: userId }])

            await expect(
                bookingService.unreserve(apartmentId, userId),
            ).rejects.toThrow(
                new BadRequestException('Apartment is not reserved'),
            )
        })

        it('should throw BadRequestException if user is not the owner of the apartment', async () => {
            const apartmentId = '1'
            const userId = '1'
            jest.spyOn(
                bookingService as any,
                'isUserAndApartmentExists',
            ).mockResolvedValueOnce([
                { isOccupied: true, currentOwner: { id: '2' } },
                { id: userId },
            ])

            await expect(
                bookingService.unreserve(apartmentId, userId),
            ).rejects.toThrow(
                new BadRequestException(
                    'You are not the owner of the apartment',
                ),
            )
        })
    })

    describe('findMyReservations', () => {
        it('should return an empty array when there are no apartments reserved by the user', async () => {
            const userId = 'someUserId'
            jest.spyOn(apartmentsRepository, 'find').mockResolvedValue([])
            const result = await bookingService.findMyReservations(userId)
            expect(result).toEqual([])
        })

        it('should return the correct apartments when there are apartments reserved by the user', async () => {
            const userId = 'someUserId'
            const user = new User()
            const apartment = new Apartment()
            const expectedApartments: Apartment[] = [
                {
                    id: '1',
                    currentOwner: { id: userId, ...user },
                    ...apartment,
                },
                {
                    id: '2',
                    currentOwner: { id: userId, ...user },
                    ...apartment,
                },
            ]
            jest.spyOn(apartmentsRepository, 'find').mockResolvedValue(
                expectedApartments,
            )

            const result = await bookingService.findMyReservations(userId)
            expect(result).toEqual(expectedApartments)
        })
    })

    describe('isUserAndApartmentExists', () => {
        it('should return a tuple containing the Apartment and User if they exist', async () => {
            const apartmentId = 'existing-apartment-id'
            const userId = 'existing-user-id'
            const mokedUser = new User()
            const mokedApartment = new Apartment()
            jest.spyOn(apartmentsRepository, 'findOne').mockResolvedValueOnce({
                id: apartmentId,
                currentOwner: { id: userId, ...mokedUser },
                ...mokedApartment,
            })
            jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce({
                id: userId,
                apartments: [],
                ...mokedUser,
            })

            const result = await (
                bookingService as any
            ).isUserAndApartmentExists(apartmentId, userId)

            expect(result).toEqual([
                { id: apartmentId, currentOwner: { id: userId } },
                { id: userId, apartments: [] },
            ])
        })

        it('should throw a BadRequestException if the apartment does not exist', async () => {
            const apartmentId = 'non-existing-apartment-id'
            const userId = 'existing-user-id'

            jest.spyOn(apartmentsRepository, 'findOne').mockResolvedValueOnce(
                undefined,
            )

            await expect(
                (bookingService as any).isUserAndApartmentExists(
                    apartmentId,
                    userId,
                ),
            ).rejects.toThrowError('Apartment does not exist')
        })

        it('should throw a BadRequestException if the user does not exist', async () => {
            const apartmentId = 'existing-apartment-id'
            const userId = 'non-existing-user-id'

            jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(
                undefined,
            )
            jest.spyOn(apartmentsRepository, 'findOne').mockResolvedValueOnce(
                undefined,
            )

            await expect(
                (bookingService as any).isUserAndApartmentExists(
                    apartmentId,
                    userId,
                ),
            ).rejects.toThrowError('Apartment does not exist')
        })
    })
})
