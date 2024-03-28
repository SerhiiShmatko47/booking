import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { TokenExpiredError } from '@nestjs/jwt'
import { FastifyReply } from 'fastify'

@Catch(TokenExpiredError)
export class JwtExpiredFilter implements ExceptionFilter {
    catch(_: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<FastifyReply>()
        response.status(401).send({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }
}
