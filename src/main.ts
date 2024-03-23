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
import helmet from '@fastify/helmet'
import fastifyCsrf from '@fastify/csrf-protection'
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule,
} from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    )

    app.enableCors()
    await app.register(compression, { encodings: ['gzip', 'deflate'] })
    await app.register(helmet, {
        contentSecurityPolicy: false,
    })
    await app.register(fastifyCsrf)

    const config = new DocumentBuilder()
        .setTitle('Booking')
        .setDescription('The Booking API description')
        .setVersion('1.0')
        .build()

    const options: SwaggerDocumentOptions = {
        operationIdFactory: (_controllerKey: string, methodKey: string) =>
            methodKey,
    }
    const document = SwaggerModule.createDocument(app, config, options)
    SwaggerModule.setup('docs', app, document)

    const configService = app.get(ConfigService<IConfiguration>)
    const logger = new Logger(bootstrap.name)
    const port = configService.get('PORT', { infer: true })
    const host = configService.get('HOST', { infer: true })
    await app.listen(port, host, () =>
        logger.log(`Listening on ${host}:${port}`),
    )
}
bootstrap()
