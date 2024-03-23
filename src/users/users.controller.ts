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
    ApiQuery,
} from '@nestjs/swagger'
import { User } from './entities/user.entity'
import { Message } from '@common/types/message.types'

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
        status: HttpStatus.CREATED,
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
    public async findAll(
        @Query('take') take: number,
        @Query('skip') skip: number,
    ): Promise<User[]> {
        return this.usersService.findAll(take, skip)
    }

    @Get(':userId')
    public async findOne(@Param('userId') userId: string): Promise<User> {
        return this.usersService.findOne(userId)
    }

    @Patch(':id')
    public update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(+id, updateUserDto)
    }

    @Delete(':id')
    public remove(@Param('id') id: string) {
        return this.usersService.remove(+id)
    }
}
