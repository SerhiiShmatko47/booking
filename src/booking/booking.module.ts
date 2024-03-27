import { Module } from '@nestjs/common'
import { BookingService } from './booking.service'
import { BookingController } from './booking.controller'
import { ApartmentsModule } from '@apartments/apartments.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@users/entities/user.entity'
import { Apartment } from '@apartments/entities/apartment.entity'

@Module({
    imports: [ApartmentsModule, TypeOrmModule.forFeature([User, Apartment])],
    controllers: [BookingController],
    providers: [BookingService],
})
export class BookingModule {}
