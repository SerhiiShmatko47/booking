import {
    Controller,
    Get,
    Body,
    Patch,
    Delete,
    HttpStatus,
    HttpCode,
    UsePipes,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger'
import { User } from './entities/user.entity'
import { Message } from '@common/types/message.types'
import { UserValidationPipe } from '@common/pipe/user-validation'
import { AuthGuard } from '@common/guards/auth/auth.guard'
import { UserContextInterceptor } from '@common/interceptors/user-context'
import { UserContext } from '@common/decorators/user-context.decorator'

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(UserContextInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Get yourself' })
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
    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    public async findOne(@UserContext('id') userId: string): Promise<User> {
        return this.usersService.findOne(userId)
    }

    @ApiOperation({ summary: 'Update yourself' })
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
    @Patch()
    @UsePipes(new UserValidationPipe())
    @HttpCode(HttpStatus.CREATED)
    public async update(
        @UserContext('id') userId: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<Message> {
        return this.usersService.update(userId, updateUserDto)
    }

    @ApiOperation({ summary: 'Delete yourself' })
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
    @Delete()
    public async remove(@UserContext('id') userId: string): Promise<Message> {
        return this.usersService.remove(userId)
    }
}
