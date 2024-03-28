import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigurationSchema } from '@config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeormConfig } from '@config/orm.config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { AdminModule } from './admin/admin.module'
import { ApartmentsModule } from './apartments/apartments.module'
import { BookingModule } from './booking/booking.module'
import { CacheModule } from '@nestjs/cache-manager'
import { RedisOptions } from '@config/redis.config'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => typeormConfig,
        }),
        ConfigModule.forRoot({
            cache: true,
            validationSchema: ConfigurationSchema,
        }),
        CacheModule.registerAsync(RedisOptions),
        UsersModule,
        AuthModule,
        AdminModule,
        ApartmentsModule,
        BookingModule,
    ],
})
export class AppModule {}
