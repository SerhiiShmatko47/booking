import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { UsersModule } from '@users/users.module'
import { ApartmentsModule } from '@apartments/apartments.module'

@Module({
    imports: [UsersModule, ApartmentsModule],
    controllers: [AdminController],
})
export class AdminModule {}
