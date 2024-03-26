import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigurationSchema } from '@config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeormConfig } from '@config/orm.config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { AdminModule } from './admin/admin.module'
import { ApartmentsModule } from './apartments/apartments.module'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => typeormConfig,
        }),
        ConfigModule.forRoot({
            cache: true,
            validationSchema: ConfigurationSchema,
        }),
        UsersModule,
        AuthModule,
        AdminModule,
        ApartmentsModule,
    ],
})
export class AppModule {}
