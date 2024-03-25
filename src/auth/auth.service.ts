import { UsersService } from '@users/users.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { User } from '@users/entities/user.entity'
import { SignUpUserDto } from './dto/signup-user.dto'
import * as bcrypt from 'bcryptjs'
import { Token } from '@common/types/token.types'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Logs in a user.
     * @param {LoginUserDto} loginUserDto - The user's login information.
     * @return {Promise<Token>} The generated token for the user.
     */
    public async login(loginUserDto: LoginUserDto): Promise<Token> {
        const user = await this.usersService.getByPhone(loginUserDto.phone)
        if (!user) throw new BadRequestException('User not found')

        const isCorrectPassword = await bcrypt.compare(
            loginUserDto.password,
            user.password,
        )
        if (isCorrectPassword) return this.generateToken(user)
        throw new BadRequestException('Wrong password')
    }

    /**
     * Signup a new user
     * @param {SignUpUserDto} signupUserDto - the user data for signing up
     * @return {Promise<Token>} the generated token
     */
    public async signup(signupUserDto: SignUpUserDto): Promise<Token> {
        const user = await this.usersService.create(signupUserDto)
        return this.generateToken(user)
    }

    /**
     * Generate a token for the given user.
     * @param {User} user - the user object for which the token is generated
     * @return {Promise<Token>} the generated token
     */
    private async generateToken(user: User): Promise<Token> {
        const token = await this.jwtService.signAsync({
            phone: user.phone,
            id: user.id,
            name: user.name,
        })
        return { token }
    }
}
