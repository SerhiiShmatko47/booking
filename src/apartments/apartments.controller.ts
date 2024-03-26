import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpCode,
    HttpStatus,
} from '@nestjs/common'
import { ApartmentsService } from './apartments.service'
import { CreateApartmentDto } from './dto/create-apartment.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Apartments')
@Controller('apartments')
export class ApartmentsController {
    constructor(private readonly apartmentsService: ApartmentsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createApartmentDto: CreateApartmentDto) {
        return this.apartmentsService.create(createApartmentDto)
    }

    @Get()
    findAll() {
        return this.apartmentsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.apartmentsService.findOne(+id)
    }
}
