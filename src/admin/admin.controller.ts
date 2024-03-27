import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common'
import { UsersService } from '@users/users.service'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger'
import { UserValidationPipe } from '@common/pipe/user-validation'
import { Message } from '@common/types/message.types'
import { UpdateUserDto } from '@users/dto/update-user.dto'
import { User } from '@users/entities/user.entity'
import { GetUsersPipe } from '@common/pipe/get-users'
import { CreateUserDto } from '@users/dto/create-user.dto'
import { Roles } from '@common/decorators/role.decorator'
import { Role } from '@common/enums/role.enum'
import { AuthGuard } from '@common/guards/auth/auth.guard'
import { RoleGuard } from '@common/guards/role/role.guard'
import { ApartmentsService } from '@apartments/apartments.service'
import { CreateApartmentDto } from '@apartments/dto/create-apartment.dto'
import { UpdateApartmentDto } from '@apartments/dto/update-apartment.dto'

@ApiTags('Admin')
@Controller('admin')
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
export class AdminController {
    constructor(
        private readonly usersService: UsersService,
        private readonly apartmnetsService: ApartmentsService,
    ) {}

    @ApiOperation({ summary: 'Create admin' })
    @ApiBody({
        type: CreateUserDto,
    })
    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        type: User,
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        schema: {
            example: {
                message: 'User already exists',
            },
        },
    })
    @ApiBearerAuth()
    @Post('users')
    @UsePipes(new UserValidationPipe())
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(ClassSerializerInterceptor)
    public async createAdmin(
        @Body() createUserDto: CreateUserDto,
    ): Promise<User> {
        return this.usersService.create(createUserDto, Role.ADMIN)
    }

    @ApiOperation({ summary: 'Get all user' })
    @ApiQuery({
        type: Number,
        name: 'take',
    })
    @ApiQuery({
        type: Number,
        name: 'skip',
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        type: [User],
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        schema: {
            example: {
                message: 'take and skip must be numbers',
            },
        },
    })
    @ApiBearerAuth()
    @Get('users')
    @UsePipes(new GetUsersPipe())
    @UseInterceptors(ClassSerializerInterceptor)
    public async findAllUsers(
        @Query('take') take: number,
        @Query('skip') skip: number,
    ): Promise<User[]> {
        return this.usersService.findAll(take, skip)
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiParam({
        name: 'userId',
        type: String,
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        type: User,
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        schema: {
            example: {
                message: 'User not found',
            },
        },
    })
    @ApiBearerAuth()
    @Get('users/:userId')
    @UseInterceptors(ClassSerializerInterceptor)
    public async findOneUser(@Param('userId') userId: string): Promise<User> {
        return this.usersService.findOne(userId)
    }

    @ApiOperation({ summary: 'Update user' })
    @ApiParam({
        type: String,
        name: 'userId',
    })
    @ApiBody({
        type: UpdateUserDto,
    })
    @ApiOkResponse({
        status: HttpStatus.CREATED,
        schema: {
            example: {
                message: 'User updated',
            },
        },
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        schema: {
            example: {
                message: 'User not found',
            },
        },
    })
    @ApiBearerAuth()
    @Patch('users/:userId')
    @UsePipes(new UserValidationPipe())
    @HttpCode(HttpStatus.CREATED)
    public async updateUser(
        @Param('userId') userId: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<Message> {
        return this.usersService.update(userId, updateUserDto)
    }

    @ApiOperation({ summary: 'Delete user' })
    @ApiParam({
        type: String,
        name: 'userId',
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        schema: {
            example: {
                message: 'User deleted',
            },
        },
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        schema: {
            example: {
                message: 'User not found',
            },
        },
    })
    @ApiBearerAuth()
    @Delete('users/:userId')
    public async removeUser(@Param('userId') userId: string): Promise<Message> {
        return this.usersService.remove(userId)
    }

    @ApiOperation({ summary: 'Create apartment' })
    @ApiBody({
        type: CreateApartmentDto,
        description: 'Apartment object',
    })
    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        schema: {
            example: {
                message: 'Apartment created',
            },
        },
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        schema: {
            example: {
                message: 'Apartment already exists',
            },
        },
    })
    @ApiBearerAuth()
    @Post('apartments')
    @HttpCode(HttpStatus.CREATED)
    public async createApartment(
        @Body() createApartmentDto: CreateApartmentDto,
    ): Promise<Message> {
        return this.apartmnetsService.create(createApartmentDto)
    }

    @ApiOperation({ summary: 'Update apartment by id' })
    @ApiParam({
        type: String,
        name: 'apartmentId',
    })
    @ApiBody({
        type: UpdateApartmentDto,
        description: 'Apartment object',
    })
    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        schema: {
            example: {
                message: 'Apartment updated',
            },
        },
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        schema: {
            example: {
                message: 'Apartment does not exist',
            },
        },
    })
    @ApiBearerAuth()
    @Patch('apartments/:apartmentId')
    @HttpCode(HttpStatus.CREATED)
    public async updateApartment(
        @Param('apartmentId') id: string,
        @Body() updateApartmentDto: UpdateApartmentDto,
    ): Promise<Message> {
        return this.apartmnetsService.update(id, updateApartmentDto)
    }

    @ApiOperation({ summary: 'Delete apartment by id' })
    @ApiParam({
        type: String,
        name: 'apartmentId',
    })
    @ApiCreatedResponse({
        status: HttpStatus.OK,
        schema: {
            example: {
                message: 'Apartment deleted',
            },
        },
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        schema: {
            example: {
                message: 'Apartment does not exist',
            },
        },
    })
    @ApiBearerAuth()
    @Delete('apartments/:apartmentId')
    public async removeApartment(@Param('apartmentId') id: string) {
        return this.apartmnetsService.remove(id)
    }
}
