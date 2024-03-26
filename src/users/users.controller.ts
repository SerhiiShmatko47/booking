import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpStatus,
    HttpCode,
    Query,
    UsePipes,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
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
import { User } from './entities/user.entity'
import { Message } from '@common/types/message.types'
import { GetUsersPipe } from '@common/pipe/get-users'
import { UserValidationPipe } from '@common/pipe/user-validation'
import { RoleGuard } from '@common/guards/role/role.guard'
import { Role } from '@common/enums/role.enum'
import { Roles } from '@common/decorators/role.decorator'
import { AuthGuard } from '@common/guards/auth/auth.guard'

@ApiTags('users')
@Controller('users')
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Create user' })
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
    @Post()
    @UsePipes(new UserValidationPipe())
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(ClassSerializerInterceptor)
    public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto)
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
    @Get()
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
    @Get(':userId')
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
    @Patch(':userId')
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
    @Delete(':userId')
    public async remove(@Param('userId') userId: string): Promise<Message> {
        return this.usersService.remove(userId)
    }
}
