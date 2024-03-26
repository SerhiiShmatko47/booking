import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext } from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { Role } from '@common/enums/role.enum'

describe('AuthGuard', () => {
    let authGuard: AuthGuard
    let jwtService: JwtService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: 'secret',
                    signOptions: { expiresIn: '1d' },
                }),
            ],
            providers: [AuthGuard],
        }).compile()

        authGuard = module.get<AuthGuard>(AuthGuard)
        jwtService = module.get<JwtService>(JwtService)
    })

    it('should return false for request with no authorization header', async () => {
        const context = {
            switchToHttp: () => ({
                getRequest: jest.fn().mockReturnValue({
                    headers: {},
                }),
                getResponse: jest.fn().mockReturnValue({}),
                getNext: jest.fn().mockReturnValue({}),
            }),
            getClass: jest.fn(),
            getHandler: jest.fn(),
            getArgs: jest.fn(),
            getArgByIndex: jest.fn(),
            switchToRpc: jest.fn(),
            switchToWs: jest.fn(),
            getType: jest.fn(),
        }
        const result = await authGuard.canActivate(context as ExecutionContext)
        expect(result).toBe(false)
    })

    it('should return true for request with authorization header', async () => {
        const payload = {
            id: '1',
            role: Role.USER,
            name: 'aaaa',
            phone: '+380961111111',
        }
        const token = await jwtService.signAsync(payload)
        const context = {
            switchToHttp: () => ({
                getRequest: jest.fn().mockReturnValue({
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }),
                getResponse: jest.fn().mockReturnValue({}),
                getNext: jest.fn().mockReturnValue({}),
            }),
            getClass: jest.fn(),
            getHandler: jest.fn(),
            getArgs: jest.fn(),
            getArgByIndex: jest.fn(),
            switchToRpc: jest.fn(),
            switchToWs: jest.fn(),
            getType: jest.fn(),
        }
        const result = await authGuard.canActivate(context as ExecutionContext)
        expect(result).toBe(true)
    })
})
