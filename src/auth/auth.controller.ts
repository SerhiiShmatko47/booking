import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UsePipes,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login-user.dto'
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger'
import { SignUpUserDto } from './dto/signup-user.dto'
import { UserValidationPipe } from '@common/pipe/user-validation'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Login user' })
    @ApiBody({
        type: LoginUserDto,
    })
    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        description: 'The generated token for the user',
        schema: {
            example: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
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
    @Post('login')
    @UsePipes(new UserValidationPipe())
    @HttpCode(HttpStatus.CREATED)
    public async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto)
    }

    @ApiOperation({ summary: 'Sign up user' })
    @ApiBody({
        type: SignUpUserDto,
    })
    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        description: 'The generated token for the user',
        schema: {
            example: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            },
        },
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        schema: {
            example: {
                message: 'User exists',
            },
        },
    })
    @Post('signup')
    @UsePipes(new UserValidationPipe())
    @HttpCode(HttpStatus.CREATED)
    public async signup(@Body() signUpUserDto: SignUpUserDto) {
        return this.authService.signup(signUpUserDto)
    }
}
