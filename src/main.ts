import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { IConfiguration } from './config/configuration'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    )
    const configService = app.get(ConfigService<IConfiguration>)
    const port = configService.get('PORT', { infer: true })
    const host = configService.get('HOST', { infer: true })
    await app.listen(port, host)
}
bootstrap()
