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
    let service: UsersService
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

        service = module.get<UsersService>(UsersService)
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

        expect(await service.create(createUserDto)).toEqual(result)
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

        await expect(service.create(createUserDto)).rejects.toThrow(
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

        await service.create(createUserDto)

        expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10)
    })
})
