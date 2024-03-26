import { Role } from '@common/enums/role.enum'
import { FastifyRequest } from 'fastify'

export type ContextRequest = FastifyRequest & {
    user: { id: string; role: Role; phone: string; name: string }
}
