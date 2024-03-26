import { ROLES_KEY } from '@common/decorators/role.decorator'
import { Role } from '@common/enums/role.enum'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        )

        if (!requiredRoles) {
            return true
        }

        const { headers } = context.switchToHttp().getRequest()

        const user = JSON.parse(
            Buffer.from(
                headers?.authorization.split(' ')[1].split('.')[1],
                'base64',
            ).toString(),
        )

        return requiredRoles.some((role) => user.role === role)
    }
}
