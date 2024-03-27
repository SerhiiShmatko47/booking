import { Controller, Get, Param, HttpStatus, Query } from '@nestjs/common'
import { ApartmentsService } from './apartments.service'
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger'
import { Apartment } from './entities/apartment.entity'

@ApiTags('Apartments')
@Controller('apartments')
export class ApartmentsController {
    constructor(private readonly apartmentsService: ApartmentsService) {}

    @ApiOperation({ summary: 'Create an apartment' })
    @ApiQuery({
        name: 'skip',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'take',
        required: false,
        type: Number,
    })
    @ApiOkResponse({
        type: [Apartment],
        description: 'Returns all apartments',
    })
    @Get()
    public async findAll(
        @Query('skip') skip: number,
        @Query('take') take: number,
    ) {
        return this.apartmentsService.findAll(take, skip)
    }

    @ApiOperation({ summary: 'Find an apartment by ID' })
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
    })
    @ApiOkResponse({
        type: Apartment,
        description: 'Returns an apartment',
    })
    @ApiBadRequestResponse({
        description: 'Apartment not found',
        schema: {
            example: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Apartment not found',
                error: 'Bad Request',
            },
        },
    })
    @Get(':id')
    public async findOne(@Param('id') id: string) {
        return this.apartmentsService.findOne(id)
    }
}
