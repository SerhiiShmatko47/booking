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
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger'
import { User } from './entities/user.entity'
import { Message } from '@common/types/message.types'
import { CreateUserPipe } from '@common/pipe/create-user/create-user.pipe'
import { UpdateUserPipe } from '@common/pipe/update-user/update-user.pipe'
import { GetUsersPipe } from '@common/pipe/get-users/get-users.pipe'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Create user' })
    @ApiBody({
        type: CreateUserDto,
    })
    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        schema: {
            example: {
                message: 'User created',
            },
        },
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        schema: {
            example: {
                message: 'User already exists',
            },
        },
    })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new CreateUserPipe())
    public async create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<Message> {
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
    @Get()
    @UsePipes(new GetUsersPipe())
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
    @Get(':userId')
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
    @Patch(':userId')
    @UsePipes(new UpdateUserPipe())
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
    @Delete(':userId')
    public async remove(@Param('userId') userId: string): Promise<Message> {
        return this.usersService.remove(userId)
    }
}
