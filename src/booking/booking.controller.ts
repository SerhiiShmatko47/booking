import {
    Controller,
    Get,
    Param,
    UseInterceptors,
    Body,
    Post,
    HttpCode,
    HttpStatus,
    Delete,
} from '@nestjs/common'
import { BookingService } from './booking.service'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger'
import { UserContext } from '@common/decorators/user-context.decorator'
import { Apartment } from '@apartments/entities/apartment.entity'
import { UserContextInterceptor } from '@common/interceptors/user-context'
import { CreateReservationDto } from './dto/create-reserve.dto'
import { Message } from '@common/types/message.types'

@ApiTags('Booking')
@Controller('booking')
@UseInterceptors(UserContextInterceptor)
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @ApiOperation({ summary: 'Get my reservations' })
    @ApiOkResponse({
        type: [Apartment],
        description: 'Get my reservations',
    })
    @ApiBadRequestResponse({
        description: 'Bad request',
        schema: {
            example: {
                message: 'User does not exist',
            },
        },
    })
    @ApiBearerAuth()
    @Get()
    public async findMyReservations(
        @UserContext('id') userId: string,
    ): Promise<Apartment[]> {
        return this.bookingService.findMyReservations(userId)
    }

    @ApiOperation({ summary: 'Reserve an apartment' })
    @ApiParam({
        name: 'apartmentId',
        description: 'The ID of the apartment to be reserved',
        type: String,
    })
    @ApiBody({
        type: CreateReservationDto,
        description: 'The start and end dates of the reservation',
    })
    @ApiOkResponse({
        description: 'Reserve an apartment',
        schema: {
            example: {
                message: 'Apartment reserved successfully',
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Bad request',
        schema: {
            example: {
                message: 'Apartment does not exist',
            },
        },
    })
    @ApiBearerAuth()
    @Post(':apartmentId')
    @HttpCode(HttpStatus.CREATED)
    public async reserve(
        @Param('apartmentId') apartmentId: string,
        @UserContext('id') userId: string,
        @Body() createReservationDto: CreateReservationDto,
    ): Promise<Message> {
        return this.bookingService.reserve(
            apartmentId,
            userId,
            createReservationDto.start,
            createReservationDto.end,
        )
    }

    @ApiOperation({ summary: 'Unreserve an apartment' })
    @ApiParam({
        name: 'apartmentId',
        description: 'The ID of the apartment to be unreserved',
        type: String,
    })
    @ApiOkResponse({
        description: 'Unreserve an apartment',
        schema: {
            example: {
                message: 'Apartment unreserved successfully',
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Bad request',
        schema: {
            example: {
                message: 'Apartment is not reserved',
            },
        },
    })
    @ApiBearerAuth()
    @Delete(':apartmentId')
    public async remove(
        @Param('apartmentId') apartmentId: string,
        @UserContext('id') userId: string,
    ): Promise<Message> {
        return this.bookingService.unreserve(apartmentId, userId)
    }
}
