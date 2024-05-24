import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserDTOResponse } from 'src/users/dto/create-user.dto';


export class LoginDTO {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty()
    @IsString()
    @MinLength(5)
    password: string;
  }

  export class RegisterDTO {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty()
    @IsString()
    @MinLength(5)
    password: string;
  }

  class LoginActionDTO {
    @ApiProperty()
    access_token: string;
  
    @ApiProperty({ type: UserDTOResponse })
    user: UserDTOResponse;
  }

  export class VerifyTokenDTO {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty()
    @IsString()
    code: string; 
  }
  


  
  export class ResendPasswordDTO {
    @ApiProperty()
    @IsNotEmpty()
    password: string;
  
    @ApiProperty()
    @IsString()
    token: string; 
  }
  
  export class OnlyToken extends PickType(ResendPasswordDTO, ['token'] as const) {}


  export class LoginResponseDTO {
    @ApiProperty()
    status: string;
  
    @ApiProperty({ type: LoginActionDTO })
    data: LoginActionDTO;
  }

  export class OnlyEmailDTO {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
  }
  

  export class TokenResendDTO extends OnlyEmailDTO {
    @ApiProperty()
    @IsNotEmpty()
    type: string;
  }