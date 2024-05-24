import { Body, Controller, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDTO, LoginResponseDTO, OnlyEmailDTO, OnlyToken, RegisterDTO, ResendPasswordDTO, TokenResendDTO, VerifyTokenDTO } from './auth.dto';
import { ErrorResponseDTO } from 'src/common/dtos/response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login') 
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint for login request' })
  @ApiOkResponse({
    description: 'Login is successful',
    type: LoginResponseDTO
  })
  @ApiBadRequestResponse({
    description: 'Credential is invalid',
    type: ErrorResponseDTO
  })
  async login(@Body() body: LoginDTO) {
    return await this.authService.login(body);
  }

  @Post('/create-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint for register request' })
  @ApiOkResponse({
    description: 'User Created Successfully',
  })
  @ApiBadRequestResponse({
    description: 'Credentials is invalid',
    type: ErrorResponseDTO
  })  
  async register(@Body() body: RegisterDTO) {
    const data = {
      ...body,
    }
    return await this.authService.createUser(data)
  }

  @Post('/verify-user-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Endpoint for verifying user email'})
  @ApiOkResponse({
    description: 'Email Verified Successfully',
  })
  @ApiBadRequestResponse({
    description: 'Credentials is invalid',
    type: ErrorResponseDTO
  }) 
  async verifiedUserEmail (@Body() body:OnlyToken ) {
    const { token } = body;
    return await this.authService.emailTokenConfirmation(token);
  }

  @Post('/resend-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Endpoint for resending token'})
  @ApiOkResponse({
    description: 'token resent Successfully',
  })
  @ApiBadRequestResponse({
    description: 'Credentials is invalid',
    type: ErrorResponseDTO
  }) 
  async resendOTPToken (@Body() body:TokenResendDTO ) {
    const { email, type } = body;
    return await this.authService.resendVerificationToken(email, type);
  }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Endpoint for sending password reset code'})
  @ApiOkResponse({
    description: 'Token Sents Successfully',
  })
  @ApiBadRequestResponse({
    description: 'Credentials is invalid',
    type: ErrorResponseDTO
  }) 

  async forgotPassword (@Body() body: OnlyEmailDTO){
    const { email } = body;
    return await this.authService.requestForgotPassword(email)
  }

  @Post('/verify-password-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Endpoint for verifying password reset code'})
  @ApiOkResponse({
    description: 'Token verified Successfully',
  })
  @ApiBadRequestResponse({
    description: 'Credentials is invalid',
    type: ErrorResponseDTO
  }) 

  async  verifyCode (@Body() body: VerifyTokenDTO){
    const { email, code } = body;
    return await this.authService.verifyForgotPassworOTP({
      email: email,
      code: code
    })
  }

  @Put('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Endpoint for password reset '})
  @ApiOkResponse({
    description: 'password resert Successfully',
  })
  @ApiBadRequestResponse({
    description: 'Credentials is invalid',
    type: ErrorResponseDTO
  }) 

  async resetPassword (@Body() body: ResendPasswordDTO){
    const { token, password } = body;
    return await this.authService.resetPassword({
      token: token,
      password: password
    })
  }
}
