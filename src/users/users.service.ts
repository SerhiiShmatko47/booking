import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
     * Creates a new user.
     * @param {CreateUserDto} createUserDto Data used to create the user.
     * @returns {Promise<Message>} A message indicating the user was created successfully.
     * @throws {HttpException} If the user already exists.
     */
    public async create(createUserDto: CreateUserDto): Promise<Message> {
        const user = await this.usersRepository.findOne({
            where: { phone: createUserDto.phone },
        })
        if (user)
            throw new HttpException(
                'User already exists',
                HttpStatus.BAD_REQUEST,
            )
        const hashPassword = await bcrypt.hash(createUserDto.password, 10)
        const newUser = this.usersRepository.create({
            ...createUserDto,
            password: hashPassword,
            createdAt: new Date(),
        })
        await this.usersRepository.save(newUser)
        return { message: 'User created successfully' }
    }

    /**
     * Returns all users.
     * @param {number} take The number of users to return.
     * @param {number} skip The number of users to skip.
     * @returns {Promise<User[]>} An array of users.
     */
    public async findAll(take: number, skip: number): Promise<User[]> {
        const users = await this.usersRepository.find({ take, skip })
        return users
    }
    /**
     * Returns a user by its ID.
     * @param {string} userId The ID of the user.
     * @returns {Promise<User>} The user found or undefined.
     * @throws {HttpException} If the user is not found.
     */
    public async findOne(userId: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        })
        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        return user
    }

    /**
     * Updates a user with the given ID using the provided data.
     *
     * @param {string} userId - The ID of the user to update.
     * @param {UpdateUserDto} updateUserDto - The data to update the user with.
     * @return {Promise<Message>} - A promise that resolves to an object with a success message.
     * @throws {HttpException} - If the user with the given ID is not found.
     */
    public async update(
        userId: string,
        updateUserDto: UpdateUserDto,
    ): Promise<Message> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        })
        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        await this.usersRepository.update({ id: userId }, updateUserDto)
        return { message: 'User updated successfully' }
    }

    /**
     * Remove a user by their ID.
     * @param {string} userId The ID of the user to be removed
     * @return {Promise<Message>} An object containing a message indicating the success of the deletion
     */
    public async remove(userId: string): Promise<Message> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        })
        if (!user)
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        await this.usersRepository.delete({ id: userId })
        return { message: 'User deleted successfully' }
    }
}
