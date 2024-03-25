import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersService } from '@users/users.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '@users/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { LoginUserDto } from './dto/login-user.dto'
import { SignUpUserDto } from './dto/signup-user.dto'
import { Token } from '@common/types/token.types'

describe('AuthController', () => {
    let authController: AuthController
    let authService: AuthService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
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

        authController = module.get<AuthController>(AuthController)
        authService = module.get<AuthService>(AuthService)
    })

    describe('login', () => {
        it('should return a token for valid login credentials', async () => {
            const loginUserDto: LoginUserDto = {
                phone: 'validPhone',
                password: 'validPassword',
            }
            jest.spyOn(authService, 'login').mockResolvedValue({
                token: 'validToken',
            })
            const result = await authController.login(loginUserDto)
            expect(result).toBeDefined()
        })

        it('should throw an error for invalid login credentials', async () => {
            const loginUserDto: LoginUserDto = {
                phone: 'invalidPhone',
                password: 'invalidPassword',
            }
            await expect(authController.login(loginUserDto)).rejects.toThrow()
        })
    })

    describe('signup', () => {
        it('should return the result of authService.signup with valid input', async () => {
            const signUpUserDto: SignUpUserDto = {
                phone: '1111111111',
                name: 'testname',
                password: 'testpassword',
            }

            const res: Token = {
                token: 'token',
            }

            jest.spyOn(authService, 'signup').mockResolvedValueOnce(res)

            expect(await authController.signup(signUpUserDto)).toBe(res)
        })

        it('should throw an error with invalid input', async () => {
            const signUpUserDto: SignUpUserDto = {
                phone: '',
                name: '',
                password: '',
            }

            await expect(authController.signup(signUpUserDto)).rejects.toThrow()
        })
    })
})
