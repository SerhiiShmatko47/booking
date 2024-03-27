import { Controller, Get, Param, Delete } from '@nestjs/common'
import { BookingService } from './booking.service'

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @Get()
    findAll() {
        return this.bookingService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingService.findOne(+id)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingService.remove(+id)
    }
}
