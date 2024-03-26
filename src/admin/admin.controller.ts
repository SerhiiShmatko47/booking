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

@ApiTags('Admin')
@Controller('admin')
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
export class AdminController {
    constructor(private readonly usersService: UsersService) {}

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
    public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
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
    public async findAll(
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
    public async findOne(@Param('userId') userId: string): Promise<User> {
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
    public async update(
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
    public async remove(@Param('userId') userId: string): Promise<Message> {
        return this.usersService.remove(userId)
    }
}
