import { ConfigService } from '@nestjs/config'
import { DataSource, DataSourceOptions } from 'typeorm'
import { IConfiguration } from './configuration'
import { config } from 'dotenv'

config()

const configService = new ConfigService<IConfiguration>()

export const typeormConfig: DataSourceOptions = {
    username: configService.get('POSTGRES_USERNAME'),
    password: configService.get('POSTGRES_PASSWORD'),
    port: configService.get('POSTGRES_PORT'),
    host: configService.get('POSTGRES_HOST'),
    database: configService.get('POSTGRES_DATABASE'),
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    type: 'postgres',
    entities: ['dist/**/*.entity.{js,ts}'],
    migrations: ['dist/migrations/*.{ts,js}'],
    migrationsRun: true,
    // logging: true,
}

export default new DataSource(typeormConfig)
