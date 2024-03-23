import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigurationSchema } from '@config/configuration'

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            validationSchema: ConfigurationSchema,
        }),
    ],
})
export class AppModule {}
