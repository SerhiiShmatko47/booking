import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigurationSchema } from '@config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeormConfig } from '@config/orm.config'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => typeormConfig,
        }),
        ConfigModule.forRoot({
            cache: true,
            validationSchema: ConfigurationSchema,
        }),
    ],
})
export class AppModule {}
