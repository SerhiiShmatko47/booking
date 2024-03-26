import { ContextRequest } from '@common/types/request.types'
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
    constructor(private readonly jwtService: JwtService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest<ContextRequest>()
        const [, token] = request.headers.authorization?.split(' ') ?? []
        const user = await this.jwtService.verifyAsync(token)
        request.user = user
        return next.handle()
    }
}
