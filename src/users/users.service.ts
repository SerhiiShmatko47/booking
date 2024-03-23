import { HttpException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from '@common/types/message.types'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    /**
     * Create new user
     * @param {CreateUserDto} createUserDto
     * @returns {Promise<Message>}
     */
    public async create(createUserDto: CreateUserDto): Promise<Message> {
        const user = await this.usersRepository.findOne({
            where: { phone: createUserDto.phone },
        })
        if (user) throw new HttpException('User already exists', 400)
        const hashPassword = await bcrypt.hash(createUserDto.password, 10)
        const newUser = this.usersRepository.create({
            ...createUserDto,
            password: hashPassword,
            createdAt: new Date(),
        })
        await this.usersRepository.save(newUser)
        return { message: 'User created successfully' }
    }

    public findAll() {
        return `This action returns all users`
    }

    public findOne(id: number) {
        return `This action returns a #${id} user`
    }

    public update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`
    }

    public remove(id: number) {
        return `This action removes a #${id} user`
    }
}
