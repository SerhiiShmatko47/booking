import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { IConfiguration } from '@config/configuration'
import { Logger } from '@nestjs/common'
import compression from '@fastify/compress'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    )

    app.enableCors()
    await app.register(compression, { encodings: ['gzip', 'deflate'] })

    const configService = app.get(ConfigService<IConfiguration>)
    const logger = new Logger(bootstrap.name)
    const port = configService.get('PORT', { infer: true })
    const host = configService.get('HOST', { infer: true })
    await app.listen(port, host, () =>
        logger.log(`Listening on ${host}:${port}`),
    )
}
bootstrap()
