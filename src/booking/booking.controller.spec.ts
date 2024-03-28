import { Test, TestingModule } from '@nestjs/testing'
import { BookingController } from './booking.controller'
import { BookingService } from './booking.service'
import { Apartment } from '@apartments/entities/apartment.entity'
import { ApartmentsService } from '@apartments/apartments.service'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '@users/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { BadRequestException } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'

describe('BookingController', () => {
    let bookingController: BookingController
    let bookingService: BookingService
    let usersRepository: Repository<User>
    let apartmentRepository: Repository<Apartment>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CacheModule.register({}),
                JwtModule.register({
                    secret: 'secret',
                    signOptions: { expiresIn: '1d' },
                }),
            ],
            controllers: [BookingController],
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

        bookingController = module.get<BookingController>(BookingController)
        bookingService = module.get<BookingService>(BookingService)
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User))
        apartmentRepository = module.get<Repository<Apartment>>(
            getRepositoryToken(Apartment),
        )
    })

    describe('findMyReservations', () => {
        it('should return an array of apartments for a valid user', async () => {
            const userId = 'validUserId'
            const expectedApartments = []
            jest.spyOn(bookingService, 'findMyReservations').mockResolvedValue(
                expectedApartments,
            )

            const result = await bookingController.findMyReservations(userId)

            expect(result).toEqual(expectedApartments)
        })

        it('should throw an error for an invalid user', async () => {
            const userId = 'invalidUserId'
            jest.spyOn(bookingService, 'findMyReservations').mockRejectedValue(
                new Error('User does not exist'),
            )

            await expect(
                bookingController.findMyReservations(userId),
            ).rejects.toThrowError('User does not exist')
        })
    })

    describe('reserve', () => {
        it('should reserve an apartment for a user', async () => {
            const apartmentId = '1'
            const userId = '1'
            const start = new Date()
            const end = new Date(start.getTime() + 3600000)

            jest.spyOn(bookingService, 'reserve').mockResolvedValue({
                message: 'Apartment reserved successfully',
            })

            const result = await bookingController.reserve(
                apartmentId,
                userId,
                {
                    start,
                    end,
                },
            )

            expect(result).toEqual({
                message: 'Apartment reserved successfully',
            })
        })

        it('should throw a BadRequestException if the apartment is already occupied', async () => {
            const apartmentId = '1'
            const userId = '1'
            const start = new Date()
            const end = new Date(start.getTime() + 3600000)

            jest.spyOn(bookingService, 'reserve').mockRejectedValue(
                new BadRequestException(),
            )

            await expect(
                bookingController.reserve(apartmentId, userId, {
                    start,
                    end,
                }),
            ).rejects.toThrow(BadRequestException)
        })

        it('should throw a BadRequestException if the date range is invalid', async () => {
            const apartmentId = '1'
            const userId = '1'
            const start = new Date()
            const end = new Date(start.getTime() - 1)

            jest.spyOn(bookingService, 'reserve').mockRejectedValue(
                new BadRequestException(),
            )

            await expect(
                bookingController.reserve(apartmentId, userId, {
                    start,
                    end,
                }),
            ).rejects.toThrow(BadRequestException)
        })
    })

    describe('unreserve', () => {
        it('should call bookingService.unreserve with the correct apartmentId and userId', async () => {
            const apartmentId = '123'
            const userId = '456'
            const apartment = new Apartment()
            const user = new User()
            jest.spyOn(bookingService, 'unreserve').mockResolvedValue({
                message: 'Success',
            })
            jest.spyOn(apartmentRepository, 'findOne').mockResolvedValue(
                apartment,
            )
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user)
            await bookingController.remove(apartmentId, userId)

            expect(bookingService.unreserve).toHaveBeenCalledWith(
                apartmentId,
                userId,
            )
        })

        it('should return the result from bookingService.unreserve', async () => {
            const expectedResult = { message: 'Success' }
            jest.spyOn(bookingService, 'unreserve').mockResolvedValue(
                expectedResult,
            )

            const result = await bookingController.remove('123', '456')

            expect(result).toEqual(expectedResult)
        })
    })
})
