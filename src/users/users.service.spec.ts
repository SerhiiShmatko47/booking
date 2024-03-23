import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { HttpException, HttpStatus } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { User } from './entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Message } from '@common/types/message.types'
import { UpdateUserDto } from './dto/update-user.dto'

describe('UsersService', () => {
    let usersService: UsersService
    let usersRepository: Repository<User>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile()

        usersService = module.get<UsersService>(UsersService)
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User))
    })

    it('should create a new user', async () => {
        const createUserDto: CreateUserDto = {
            phone: '1234567890',
            name: 'John',
            password: 'password',
        }
        const hashPassword = 'hashedPassword'
        jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashPassword as never)
        jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined)
        jest.spyOn(usersRepository, 'create').mockReturnValue({
            ...createUserDto,
            id: '1',
            password: hashPassword,
            createdAt: new Date(),
        })
        jest.spyOn(usersRepository, 'save').mockResolvedValue(undefined)

        const result: Message = {
            message: 'User created successfully',
        }

        expect(await usersService.create(createUserDto)).toEqual(result)
    })

    it('should throw an error if the user already exists', async () => {
        const createUserDto: CreateUserDto = {
            phone: '1234567890',
            name: 'John',
            password: 'password',
        }
        jest.spyOn(usersRepository, 'findOne').mockResolvedValue({
            ...createUserDto,
            id: '1',
            createdAt: new Date(),
        })

        await expect(usersService.create(createUserDto)).rejects.toThrow(
            new HttpException('User already exists', 400),
        )
    })

    it('should hash the password before saving', async () => {
        const createUserDto: CreateUserDto = {
            phone: '1234567890',
            name: 'John',
            password: 'password',
        }
        const hashPassword = 'hashedPassword'
        jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashPassword as never)
        jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined)
        jest.spyOn(usersRepository, 'create').mockReturnValue({
            ...createUserDto,
            password: hashPassword,
            createdAt: new Date(),
            id: '1',
        })
        jest.spyOn(usersRepository, 'save').mockResolvedValue(undefined)

        await usersService.create(createUserDto)

        expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10)
    })

    it('should return an array of users when called with valid arguments', async () => {
        const users: User[] = [
            {
                id: '1',
                name: 'John',
                phone: '1234567890',
                createdAt: new Date(),
                password: 'password',
            },
            {
                id: '2',
                name: 'Jane',
                phone: '0987654321',
                createdAt: new Date(),
                password: 'password',
            },
        ]
        jest.spyOn(usersRepository, 'find').mockResolvedValue(users)

        const result = await usersService.findAll(2, 0)

        expect(result).toEqual(users)
    })

    it('should return an empty array when called with arguments that result in no users being found', async () => {
        jest.spyOn(usersRepository, 'find').mockResolvedValue([])

        const result = await usersService.findAll(2, 0)

        expect(result).toEqual([])
    })

    it('should throw an error when called with invalid arguments', async () => {
        await expect(usersService.findAll(-1, 0)).rejects.toThrowError()
    })

    it('should return the user when it is found', async () => {
        const userId = '123'
        const user = {
            id: userId,
            name: 'John Doe',
            phone: '1234567890',
            createdAt: new Date(),
            password: 'password',
        }
        jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user)

        const result = await usersService.findOne(userId)

        expect(result).toEqual(user)
    })

    it('should throw an HttpException with status 404 when the user is not found', async () => {
        const userId = '123'
        jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined)

        await expect(usersService.findOne(userId)).rejects.toThrow(
            new HttpException('User not found', 404),
        )
    })

    it('should update the user and return a success message', async () => {
        const userId = '1'
        const updateUserDto: UpdateUserDto = {
            phone: '0987654321',
        }
        const expectedMessage = { message: 'User updated successfully' }

        jest.spyOn(usersRepository, 'findOne').mockResolvedValue({
            id: userId,
            phone: '1234567890',
            name: 'John',
            createdAt: new Date(),
            password: 'password',
        })
        jest.spyOn(usersRepository, 'update').mockResolvedValue(undefined)

        const result = await usersService.update(userId, updateUserDto)

        expect(usersRepository.findOne).toHaveBeenCalledWith({
            where: { id: userId },
        })
        expect(usersRepository.update).toHaveBeenCalledWith(
            { id: userId },
            updateUserDto,
        )
        expect(result).toEqual(expectedMessage)
    })

    it('should throw an exception when trying to update a non-existent user', async () => {
        const userId = '1'
        const updateUserDto: UpdateUserDto = {
            phone: '1234567890',
        }

        jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined)

        await expect(
            usersService.update(userId, updateUserDto),
        ).rejects.toThrow(HttpException)
        expect(usersRepository.findOne).toHaveBeenCalledWith({
            where: { id: userId },
        })
    })

    it('should throw an HttpException with status code 404 when the user is not found', async () => {
        const userId = 'non-existent-user-id'
        jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined)
        await expect(usersService.remove(userId)).rejects.toThrow(HttpException)
        await expect(usersService.remove(userId)).rejects.toHaveProperty(
            'status',
            HttpStatus.BAD_REQUEST,
        )
    })

    it('should delete the user with the specified ID from the repository', async () => {
        const userId = 'existing-user-id'
        const user = {
            id: userId,
            name: 'John',
            phone: '1234567890',
            password: 'password',
            createdAt: new Date(),
        }
        jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user)
        jest.spyOn(usersRepository, 'delete').mockResolvedValue(undefined)

        await usersService.remove(userId)

        expect(usersRepository.delete).toHaveBeenCalledWith({ id: userId })
    })

    it('should return an object with a message property set to "User deleted successfully"', async () => {
        const userId = 'existing-user-id'
        const user = {
            id: userId,
            name: 'John',
            phone: '1234567890',
            password: 'password',
            createdAt: new Date(),
        }
        jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user)
        jest.spyOn(usersRepository, 'delete').mockResolvedValue(undefined)

        const result = await usersService.remove(userId)

        expect(result).toHaveProperty('message', 'User deleted successfully')
    })
})
