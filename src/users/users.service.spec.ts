import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { HttpException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { User } from './entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Message } from '@common/types/message.types'

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
})
