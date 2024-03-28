import { Test, TestingModule } from '@nestjs/testing'
import { Message } from '@common/types/message.types'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Role } from '@common/enums/role.enum'
import { JwtModule } from '@nestjs/jwt'
import { AdminController } from './admin.controller'
import { UsersService } from '@users/users.service'
import { User } from '@users/entities/user.entity'
import { CreateUserDto } from '@users/dto/create-user.dto'
import { UpdateUserDto } from '@users/dto/update-user.dto'
import { ApartmentsService } from '@apartments/apartments.service'
import { Repository } from 'typeorm'
import { Apartment } from '@apartments/entities/apartment.entity'
import { CreateApartmentDto } from '@apartments/dto/create-apartment.dto'
import { ApartmentsType } from '@common/enums/apartments.enum'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { UpdateApartmentDto } from '@apartments/dto/update-apartment.dto'
import { CacheModule } from '@nestjs/cache-manager'

describe('AdminController', () => {
    let adminController: AdminController
    let usersService: UsersService
    let apartmentsService: ApartmentsService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'secret',
                    signOptions: { expiresIn: '1d' },
                }),
                CacheModule.register({}),
            ],
            controllers: [AdminController],
            providers: [
                ApartmentsService,
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Apartment),
                    useClass: Repository,
                },
            ],
        }).compile()

        adminController = app.get<AdminController>(AdminController)
        usersService = app.get<UsersService>(UsersService)
        apartmentsService = app.get<ApartmentsService>(ApartmentsService)
    })

    describe('create', () => {
        it('should return a promise that resolves to a Message object when given a valid createUserDto object', async () => {
            const createUserDto: CreateUserDto = {
                phone: '1234567890',
                name: 'John',
                password: 'password',
            }
            const user: User = {
                ...createUserDto,
                id: '1',
                createdAt: new Date(),
                role: Role.USER,
                apartments: [],
            }

            jest.spyOn(usersService, 'create').mockResolvedValue(user)

            const result = await adminController.createAdmin(createUserDto)

            expect(result).toEqual(user)
        })

        it('should throw an error when given an invalid createUserDto object', async () => {
            const createUserDto: CreateUserDto = {
                phone: '1234567890',
                name: 'John',
                password: 'password',
            }
            jest.spyOn(usersService, 'create').mockRejectedValue(
                new Error('Invalid createUserDto object'),
            )

            await expect(
                adminController.createAdmin(createUserDto),
            ).rejects.toThrowError('Invalid createUserDto object')
        })
    })

    describe('findAll', () => {
        it('should return an array of users when given valid take and skip parameters', async () => {
            const users: User[] = [
                {
                    id: '1',
                    name: 'John',
                    createdAt: new Date(),
                    password: 'password',
                    phone: '1234567890',
                    role: Role.USER,
                    apartments: [],
                },
                {
                    id: '2',
                    name: 'Jane',
                    createdAt: new Date(),
                    password: 'password',
                    phone: '0987654321',
                    role: Role.USER,
                    apartments: [],
                },
            ]
            jest.spyOn(usersService, 'findAll').mockResolvedValue(users)

            expect(await adminController.findAllUsers(2, 0)).toBe(users)
        })

        it('should return an empty array when given invalid take and skip parameters', async () => {
            jest.spyOn(usersService, 'findAll').mockResolvedValue([])

            expect(await adminController.findAllUsers(-1, -1)).toEqual([])
        })

        it('should return an empty array when there are no users in the database', async () => {
            jest.spyOn(usersService, 'findAll').mockResolvedValue([])

            expect(await adminController.findAllUsers(10, 0)).toEqual([])
        })

        it('should return the correct number of users when given valid take and skip parameters', async () => {
            const users: User[] = [
                {
                    id: '1',
                    name: 'John',
                    createdAt: new Date(),
                    password: 'password',
                    phone: '1234567890',
                    role: Role.USER,
                    apartments: [],
                },
                {
                    id: '2',
                    name: 'Jane',
                    createdAt: new Date(),
                    password: 'password',
                    phone: '0987654321',
                    role: Role.USER,
                    apartments: [],
                },
            ]
            jest.spyOn(usersService, 'findAll').mockResolvedValue([users[0]])

            expect((await adminController.findAllUsers(1, 0)).length).toBe(1)

            jest.spyOn(usersService, 'findAll').mockResolvedValue(users)
            expect((await adminController.findAllUsers(2, 0)).length).toBe(2)
        })

        it('should return the correct users when given valid take and skip parameters', async () => {
            const users: User[] = [
                {
                    id: '1',
                    name: 'John',
                    createdAt: new Date(),
                    password: 'password',
                    phone: '1234567890',
                    role: Role.USER,
                    apartments: [],
                },
                {
                    id: '2',
                    name: 'Jane',
                    createdAt: new Date(),
                    password: 'password',
                    phone: '0987654321',
                    role: Role.USER,
                    apartments: [],
                },
            ]
            jest.spyOn(usersService, 'findAll').mockResolvedValue([users[0]])
            expect(await adminController.findAllUsers(1, 0)).toEqual([users[0]])

            jest.spyOn(usersService, 'findAll').mockResolvedValue([users[1]])
            expect(await adminController.findAllUsers(1, 1)).toEqual([users[1]])
        })
    })

    describe('findOne', () => {
        it('should return a user when a valid userId is provided', async () => {
            const userId = 'validUserId'
            const user: User = {
                id: userId,
                name: 'John Doe',
                phone: '1234567890',
                password: 'password',
                createdAt: new Date(),
                role: Role.USER,
                apartments: [],
            }
            jest.spyOn(usersService, 'findOne').mockResolvedValue(user)

            expect(await adminController.findOneUser(userId)).toEqual(user)
        })

        it('should return null when an empty userId is provided', async () => {
            const userId = ''
            const user = null
            jest.spyOn(usersService, 'findOne').mockResolvedValue(user)

            expect(await adminController.findOneUser(userId)).toBeNull()
        })
    })

    describe('update', () => {
        it('should update a user', async () => {
            const userId = 'user123'
            const updateUserDto: UpdateUserDto = {
                phone: '1234567890',
            }

            jest.spyOn(usersService, 'update').mockImplementation(() =>
                Promise.resolve({ message: 'User updated' }),
            )

            expect(
                await adminController.updateUser(userId, updateUserDto),
            ).toEqual({ message: 'User updated' })
        })

        it('should handle empty userId', async () => {
            const userId = ''
            const updateUserDto: UpdateUserDto = { name: 'Jane Doe' }

            expect(
                adminController.updateUser(userId, updateUserDto),
            ).rejects.toThrow()
        })

        it('should handle empty updateUserDto', async () => {
            const userId = 'user456'
            const updateUserDto: UpdateUserDto = {}

            expect(
                adminController.updateUser(userId, updateUserDto),
            ).rejects.toThrow()
        })
    })

    describe('remove', () => {
        it('should call usersService.remove with the correct userId and return the result', async () => {
            const userId = '123'
            const message: Message = { message: 'User deleted successfully' }
            jest.spyOn(usersService, 'remove').mockResolvedValue(message)

            const result = await adminController.removeUser(userId)

            expect(usersService.remove).toHaveBeenCalledWith(userId)
            expect(result).toBe(message)
        })

        it('should throw an error if usersService.remove throws an error', async () => {
            const userId = '123'
            const errorMessage = 'Error removing user'
            jest.spyOn(usersService, 'remove').mockRejectedValue(
                new Error(errorMessage),
            )

            await expect(
                adminController.removeUser(userId),
            ).rejects.toThrowError(errorMessage)
        })
    })

    describe('create apartment', () => {
        it('should create a new apartment successfully', async () => {
            const createApartmentDto: CreateApartmentDto = {
                sequenceNumber: 1,
                isOccupied: false,
                type: ApartmentsType.studio,
            }
            jest.spyOn(apartmentsService, 'create').mockResolvedValue({
                message: 'Apartment created successfully',
            })

            const result =
                await adminController.createApartment(createApartmentDto)

            expect(result).toEqual({
                message: 'Apartment created successfully',
            })
            expect(apartmentsService.create).toHaveBeenCalledWith(
                createApartmentDto,
            )
        })

        it('should throw a BadRequestException when an apartment with the same sequence number already exists', async () => {
            const createApartmentDto: CreateApartmentDto = {
                sequenceNumber: 1,
                isOccupied: false,
                type: ApartmentsType.studio,
            }
            jest.spyOn(apartmentsService, 'create').mockRejectedValue(
                new BadRequestException('Apartment already exists'),
            )

            await expect(
                adminController.createApartment(createApartmentDto),
            ).rejects.toThrow(BadRequestException)
            expect(apartmentsService.create).toHaveBeenCalledWith(
                createApartmentDto,
            )
        })
    })

    describe('update apartment', () => {
        it('should update an apartment', async () => {
            const apartmentId = '1'
            const updateApartmentDto: UpdateApartmentDto = {
                isOccupied: true,
            }
            const expectedMessage: Message = {
                message: 'Apartment updated successfully',
            }

            jest.spyOn(apartmentsService, 'update').mockResolvedValueOnce(
                expectedMessage,
            )

            expect(
                await adminController.updateApartment(
                    apartmentId,
                    updateApartmentDto,
                ),
            ).toEqual(expectedMessage)
        })

        it('should throw an error if apartment is not found', async () => {
            const apartmentId = '1'
            const updateApartmentDto: UpdateApartmentDto = {
                isOccupied: true,
            }
            const expectedError = new NotFoundException('Apartment not found')

            jest.spyOn(apartmentsService, 'update').mockRejectedValueOnce(
                expectedError,
            )

            await expect(
                adminController.updateApartment(
                    apartmentId,
                    updateApartmentDto,
                ),
            ).rejects.toThrowError(expectedError)
        })
    })

    describe('delete apartment', () => {
        it('should remove an apartment with a valid ID', async () => {
            const apartmentId = 'validId'
            const message: Message = {
                message: 'Apartment deleted successfully',
            }
            jest.spyOn(apartmentsService, 'remove').mockResolvedValue(message)
            expect(await adminController.removeApartment(apartmentId)).toBe(
                message,
            )
        })

        it('should not remove an apartment with an invalid ID', async () => {
            const apartmentId = 'invalidId'
            const error = new BadRequestException('Apartment not found')
            jest.spyOn(apartmentsService, 'remove').mockResolvedValue(error)
            expect(await adminController.removeApartment(apartmentId)).toBe(
                error,
            )
        })
    })
})
