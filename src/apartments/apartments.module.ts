import { Module } from '@nestjs/common'
import { ApartmentsService } from './apartments.service'
import { ApartmentsController } from './apartments.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Apartment } from './entities/apartment.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Apartment])],
    controllers: [ApartmentsController],
    providers: [ApartmentsService],
    exports: [ApartmentsService],
})
export class ApartmentsModule {}
