import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserContextInterceptor } from './user-context.interceptor'

describe('UserContextInterceptor', () => {
    let userContextInterceptor: UserContextInterceptor
    let jwtService: JwtService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserContextInterceptor,
                {
                    provide: JwtService,
                    useValue: {
                        verifyAsync: jest
                            .fn()
                            .mockReturnValue({ id: 1, username: 'testuser' }),
                    },
                },
            ],
        }).compile()

        userContextInterceptor = module.get<UserContextInterceptor>(
            UserContextInterceptor,
        )
        jwtService = module.get<JwtService>(JwtService)
    })

    it('should set user in request if valid authorization token is provided', async () => {
        const request = { headers: { authorization: 'Bearer validtoken' } }
        const mockContext: ExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => request,
            }),
        } as ExecutionContext

        const mockCallHandler = {
            handle: jest.fn(),
        }
        const user = {
            id: 1,
            username: 'testuser',
        }
        jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(user)
        await userContextInterceptor.intercept(mockContext, mockCallHandler)

        expect(mockContext.switchToHttp().getRequest().user).toEqual(user)
    })

    it('should not set user in request if invalid authorization token is provided', async () => {
        const mockContext: ExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { authorization: 'Bearer invalidtoken' },
                }),
            }),
        } as ExecutionContext

        const mockCallHandler = {
            handle: jest.fn(),
        }

        await userContextInterceptor.intercept(mockContext, mockCallHandler)

        expect(mockContext.switchToHttp().getRequest().user).toBeUndefined()
    })

    it('should not set user in request if authorization token is missing', async () => {
        const mockContext: ExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({ headers: {} }),
            }),
        } as ExecutionContext

        const mockCallHandler = {
            handle: jest.fn(),
        }

        await userContextInterceptor.intercept(mockContext, mockCallHandler)

        expect(mockContext.switchToHttp().getRequest().user).toBeUndefined()
    })
})
