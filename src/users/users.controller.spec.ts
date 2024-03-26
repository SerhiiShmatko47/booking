import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { Message } from '@common/types/message.types'
import { User } from './entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UpdateUserDto } from './dto/update-user.dto'
import { Role } from '@common/enums/role.enum'
import { JwtModule } from '@nestjs/jwt'

describe('UsersController', () => {
    let usersController: UsersController
    let usersService: UsersService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'secret',
                    signOptions: { expiresIn: '1d' },
                }),
            ],
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {},
                },
            ],
        }).compile()

        usersController = app.get<UsersController>(UsersController)
        usersService = app.get<UsersService>(UsersService)
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

            expect(await usersController.findOne(userId)).toEqual(user)
        })

        it('should return null when an empty userId is provided', async () => {
            const userId = ''
            const user = null
            jest.spyOn(usersService, 'findOne').mockResolvedValue(user)

            expect(await usersController.findOne(userId)).toBeNull()
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

            expect(await usersController.update(userId, updateUserDto)).toEqual(
                { message: 'User updated' },
            )
        })

        it('should handle empty userId', async () => {
            const userId = ''
            const updateUserDto: UpdateUserDto = { name: 'Jane Doe' }

            expect(
                usersController.update(userId, updateUserDto),
            ).rejects.toThrow()
        })

        it('should handle empty updateUserDto', async () => {
            const userId = 'user456'
            const updateUserDto: UpdateUserDto = {}

            expect(
                usersController.update(userId, updateUserDto),
            ).rejects.toThrow()
        })
    })

    describe('remove', () => {
        it('should call usersService.remove with the correct userId and return the result', async () => {
            const userId = '123'
            const message: Message = { message: 'User deleted successfully' }
            jest.spyOn(usersService, 'remove').mockResolvedValue(message)

            const result = await usersController.remove(userId)

            expect(usersService.remove).toHaveBeenCalledWith(userId)
            expect(result).toBe(message)
        })

        it('should throw an error if usersService.remove throws an error', async () => {
            const userId = '123'
            const errorMessage = 'Error removing user'
            jest.spyOn(usersService, 'remove').mockRejectedValue(
                new Error(errorMessage),
            )

            await expect(usersController.remove(userId)).rejects.toThrowError(
                errorMessage,
            )
        })
    })
})
