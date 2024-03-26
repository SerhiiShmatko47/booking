import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const [bearer, token] = request.headers.authorization?.split(' ') ?? []
        if (bearer === 'Bearer' || token) {
            await this.jwtService.verifyAsync(token)
            return true
        }
        return false
    }
}
