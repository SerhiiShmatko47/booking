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

describe('AdminController', () => {
    let adminController: AdminController
    let usersService: UsersService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'secret',
                    signOptions: { expiresIn: '1d' },
                }),
            ],
            controllers: [AdminController],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {},
                },
            ],
        }).compile()

        adminController = app.get<AdminController>(AdminController)
        usersService = app.get<UsersService>(UsersService)
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
            }

            jest.spyOn(usersService, 'create').mockResolvedValue(user)

            const result = await adminController.create(createUserDto)

            expect(result).toEqual(user)
            expect(usersService.create).toHaveBeenCalledWith(createUserDto)
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
                adminController.create(createUserDto),
            ).rejects.toThrowError('Invalid createUserDto object')
            expect(usersService.create).toHaveBeenCalledWith(createUserDto)
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
                },
                {
                    id: '2',
                    name: 'Jane',
                    createdAt: new Date(),
                    password: 'password',
                    phone: '0987654321',
                    role: Role.USER,
                },
            ]
            jest.spyOn(usersService, 'findAll').mockResolvedValue(users)

            expect(await adminController.findAll(2, 0)).toBe(users)
        })

        it('should return an empty array when given invalid take and skip parameters', async () => {
            jest.spyOn(usersService, 'findAll').mockResolvedValue([])

            expect(await adminController.findAll(-1, -1)).toEqual([])
        })

        it('should return an empty array when there are no users in the database', async () => {
            jest.spyOn(usersService, 'findAll').mockResolvedValue([])

            expect(await adminController.findAll(10, 0)).toEqual([])
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
                },
                {
                    id: '2',
                    name: 'Jane',
                    createdAt: new Date(),
                    password: 'password',
                    phone: '0987654321',
                    role: Role.USER,
                },
            ]
            jest.spyOn(usersService, 'findAll').mockResolvedValue([users[0]])

            expect((await adminController.findAll(1, 0)).length).toBe(1)

            jest.spyOn(usersService, 'findAll').mockResolvedValue(users)
            expect((await adminController.findAll(2, 0)).length).toBe(2)
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
                },
                {
                    id: '2',
                    name: 'Jane',
                    createdAt: new Date(),
                    password: 'password',
                    phone: '0987654321',
                    role: Role.USER,
                },
            ]
            jest.spyOn(usersService, 'findAll').mockResolvedValue([users[0]])
            expect(await adminController.findAll(1, 0)).toEqual([users[0]])

            jest.spyOn(usersService, 'findAll').mockResolvedValue([users[1]])
            expect(await adminController.findAll(1, 1)).toEqual([users[1]])
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
            }
            jest.spyOn(usersService, 'findOne').mockResolvedValue(user)

            expect(await adminController.findOne(userId)).toEqual(user)
        })

        it('should return null when an empty userId is provided', async () => {
            const userId = ''
            const user = null
            jest.spyOn(usersService, 'findOne').mockResolvedValue(user)

            expect(await adminController.findOne(userId)).toBeNull()
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

            expect(await adminController.update(userId, updateUserDto)).toEqual(
                { message: 'User updated' },
            )
        })

        it('should handle empty userId', async () => {
            const userId = ''
            const updateUserDto: UpdateUserDto = { name: 'Jane Doe' }

            expect(
                adminController.update(userId, updateUserDto),
            ).rejects.toThrow()
        })

        it('should handle empty updateUserDto', async () => {
            const userId = 'user456'
            const updateUserDto: UpdateUserDto = {}

            expect(
                adminController.update(userId, updateUserDto),
            ).rejects.toThrow()
        })
    })

    describe('remove', () => {
        it('should call usersService.remove with the correct userId and return the result', async () => {
            const userId = '123'
            const message: Message = { message: 'User deleted successfully' }
            jest.spyOn(usersService, 'remove').mockResolvedValue(message)

            const result = await adminController.remove(userId)

            expect(usersService.remove).toHaveBeenCalledWith(userId)
            expect(result).toBe(message)
        })

        it('should throw an error if usersService.remove throws an error', async () => {
            const userId = '123'
            const errorMessage = 'Error removing user'
            jest.spyOn(usersService, 'remove').mockRejectedValue(
                new Error(errorMessage),
            )

            await expect(adminController.remove(userId)).rejects.toThrowError(
                errorMessage,
            )
        })
    })
})
