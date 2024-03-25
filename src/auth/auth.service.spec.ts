import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { BadRequestException } from '@nestjs/common'
import { LoginUserDto } from './dto/login-user.dto'
import { User } from '@users/entities/user.entity'
import { Role } from '@common/enums/role.enum'
import { JwtModule } from '@nestjs/jwt'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { SignUpUserDto } from './dto/signup-user.dto'
import { Token } from '@common/types/token.types'

describe('AuthService', () => {
    let authService: AuthService
    let usersService: UsersService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'secret',
                    signOptions: { expiresIn: '1d' },
                }),
            ],
            providers: [
                AuthService,
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {},
                },
            ],
        }).compile()

        authService = module.get<AuthService>(AuthService)
        usersService = module.get<UsersService>(UsersService)
    })
    describe('login', () => {
        it('should throw BadRequestException for a valid login with incorrect password', async () => {
            const loginUserDto: LoginUserDto = {
                phone: '1234567890',
                password: 'incorrectPassword',
            }
            const user: User = {
                id: '1',
                phone: '1234567890',
                password: 'correctPassword',
                name: 'John',
                role: Role.USER,
                createdAt: new Date(),
            }
            jest.spyOn(usersService, 'getByPhone').mockResolvedValue(user)

            await expect(authService.login(loginUserDto)).rejects.toThrow(
                BadRequestException,
            )
        })

        it('should return a token for a valid login with correct credentials', async () => {
            const loginUserDto: LoginUserDto = {
                phone: '1234567890',
                password: 'correctPassword',
            }
            const user: User = {
                id: '1',
                phone: '1234567890',
                password: 'correctPassword',
                name: 'John',
                role: Role.USER,
                createdAt: new Date(),
            }
            jest.spyOn(usersService, 'getByPhone').mockResolvedValue(user)
            jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true)
            jest.spyOn(authService as any, 'generateToken').mockReturnValue({
                token: 'generatedToken',
            })
            const result = await authService.login(loginUserDto)
            expect(result).toEqual({ token: 'generatedToken' })
        })

        it('should throw BadRequestException for an invalid user', async () => {
            const loginUserDto: LoginUserDto = {
                phone: '1234567890',
                password: 'anyPassword',
            }
            jest.spyOn(usersService, 'getByPhone').mockResolvedValue(null)

            await expect(authService.login(loginUserDto)).rejects.toThrow(
                BadRequestException,
            )
        })
    })

    describe('signup', () => {
        it('should return a generated token when signing up with valid user data', async () => {
            const signupUserDto: SignUpUserDto = {
                password: 'anyPassword',
                name: 'anyName',
                phone: '+30000000000',
            }
            jest.spyOn(usersService, 'create').mockResolvedValue({
                id: '1',
                ...signupUserDto,
                role: Role.USER,
                createdAt: new Date(),
            })
            jest.spyOn(authService as any, 'generateToken').mockReturnValue({
                token: 'token',
            })
            const generatedToken: Token =
                await authService.signup(signupUserDto)
            expect(generatedToken).toBeDefined()
        })

        it('should throw an error when signing up with invalid user data', async () => {
            const invalidSignupUserDto: SignUpUserDto = {
                password: 'anyPassword',
                name: 'anyName',
                phone: 'anyPhone',
            }
            await expect(
                authService.signup(invalidSignupUserDto),
            ).rejects.toThrow()
        })
    })

    describe('generateToken', () => {
        it('should generate a token for a user with all valid fields', async () => {
            const user = {
                id: '123',
                name: 'Alice',
                phone: '1234567890',
                role: 'admin',
            }
            const token = await (authService as any).generateToken(user)
            expect(token.token).toBeDefined()
        })
    })
})
