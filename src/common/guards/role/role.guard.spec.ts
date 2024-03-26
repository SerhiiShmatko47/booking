import { Test } from '@nestjs/testing'
import { Reflector } from '@nestjs/core'
import { ExecutionContext } from '@nestjs/common'
import { RoleGuard } from './role.guard'
import { Role } from '@common/enums/role.enum'

describe('RoleGuard', () => {
    let guard: RoleGuard
    let reflector: Reflector
    let context: ExecutionContext

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                RoleGuard,
                {
                    provide: Reflector,
                    useValue: {
                        getAllAndOverride: jest.fn(),
                    },
                },
            ],
        }).compile()

        guard = moduleRef.get<RoleGuard>(RoleGuard)
        reflector = moduleRef.get<Reflector>(Reflector)
        context = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    user: {
                        roles: [],
                    },
                }),
            }),
            getHandler: jest.fn(),
            getClass: jest.fn(),
        } as any
    })

    it('should return true when there are no required roles', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined)
        expect(guard.canActivate(context)).toBe(true)
    })

    it('should return true when the user has one of the required roles', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN])
        context.switchToHttp().getRequest().user.roles = [Role.ADMIN]
        expect(guard.canActivate(context)).toBe(true)
    })

    it('should return false when the user does not have any of the required roles', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN])
        context.switchToHttp().getRequest().user.roles = [Role.USER]
        expect(guard.canActivate(context)).toBe(false)
    })
})
