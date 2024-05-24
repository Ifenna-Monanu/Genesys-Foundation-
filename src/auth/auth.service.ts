import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { LoginDTO, RegisterDTO, ResendPasswordDTO, VerifyTokenDTO } from './auth.dto';
import { TokenService } from 'src/token/token.service';
import { TOKENTYPE } from 'src/token/token.schema';
import * as bcrypt from 'bcrypt'
import { randomToken } from 'src/util/random.util';
import { sendPasswordResetEmail } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService
  ){}

  getConstantTime () {
    return 10 * 60 * 1000;
  }

  getCurrentTime () {
    return new Date().getTime()
  }

  async validateUser(payload:any) {
    const user = await this.userService.findOne({ email: payload.email });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login(body: LoginDTO) {
    const { email, password } = body;

    const user = await this.userService.findOne({
      email,
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!user?.password) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const accessToken =await  this.jwtService.signAsync({ _id: user._id });

    return {
      user,
      access_token: accessToken
    };
  }


  async createUser(createAuthDto: RegisterDTO) {
    const user = await this.userService.findOne({email: createAuthDto.email});
    
    if(user) {
      throw new BadRequestException('users already exists');
    };
    const newUser = await this.userService.create(createAuthDto);
    const token = randomToken();
    await this.tokenService.createToken({
      userId: newUser._id,
      token: token,
      expirationDate: new Date().setTime(this.getCurrentTime() + this.getConstantTime() ) as any,
      tokenType: TOKENTYPE.EMAIL_CONFIRM
    })
    await sendPasswordResetEmail({
      to: newUser.email,
      token: token
    })
    return {
      message: 'Check your email for user verification',
    };
  }  

  async emailTokenConfirmation (token: string) {
    const foundToken = await this.tokenService.getToken({token: token, tokenType: TOKENTYPE.EMAIL_CONFIRM});
    if(!foundToken) throw new NotFoundException('user not found');
    if(this.getCurrentTime() > foundToken.expirationDate.getTime()) {
      throw new TokenExpiredError('Token expired already', foundToken.expirationDate)
    }
    const verifedUser = await this.userService.update({_id: foundToken.userId}, {emailVerified: true})
    const userToken = await this.jwtService.signAsync({
      id: verifedUser._id
    }, 
    );
    return {
      data: {
        token: userToken,
        userDetails: verifedUser
      }
    }
  }

  async resendVerificationToken (email: string, type: string) {
    const user = await this.userService.findOne({email: email});
    const token = randomToken();
    if(!user) throw new BadRequestException('user with email does not exist'); 
    if(type === TOKENTYPE.PASSWORD_REST) {
      await this.tokenService.createToken({
        userId: user._id,
        token: token,
        expirationDate: new Date().setTime(this.getCurrentTime() + this.getConstantTime() ) as any,
        tokenType: TOKENTYPE.PASSWORD_REST
      })
  
      await sendPasswordResetEmail({
        to: user.email,
        token: token
      })
    }else {
      await this.tokenService.createToken({
        userId: user._id,
        token: token,
        expirationDate: new Date().setTime(this.getCurrentTime() + this.getConstantTime() ) as any,
        tokenType: TOKENTYPE.EMAIL_CONFIRM
      })
      await sendPasswordResetEmail({
        to: user.email,
        token: token
      })
    }
  }

  async requestForgotPassword(email: string) {
    const user = await this.userService.findOne({email: email});
    if(!user) throw new BadRequestException('user with email does not exist');
    const token = await this.tokenService.getToken({userId: user._id, tokenType: TOKENTYPE.PASSWORD_REST});
    if(token) await token.deleteOne()
    const resetToken = randomToken();
    await this.tokenService.createToken({
      userId: user._id,
      token: resetToken,
      expirationDate: new Date().setTime(this.getCurrentTime() + this.getConstantTime() ) as any,
      tokenType: TOKENTYPE.PASSWORD_REST
    })

    await sendPasswordResetEmail({
      to: user.email,
      token: resetToken
    })
  }

  async verifyForgotPassworOTP (verifyDTO: VerifyTokenDTO ) {
    const { email, code } = verifyDTO;
    const user = await this.userService.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const recoverToken = await this.tokenService.getToken({
      userId: user._id,
      tokenType: TOKENTYPE.PASSWORD_REST
    });
    if (!recoverToken) throw new BadRequestException('password reset token not found');
    if (this.getCurrentTime() > recoverToken.expirationDate.getTime()) {
      throw new BadRequestException('Invalid or expired password reset token');    
    }
    const isValid = await bcrypt.compare(code, recoverToken.token)
    if (!isValid) throw new BadRequestException('Invalid or expired password reset token');
    const token = await this.jwtService.signAsync({
      id: recoverToken.userId
    }, 
      { expiresIn: '5mins', algorithm: 'HS512' }
    )
    return {data: {token}};
  }

  async resetPassword (resetDTO: ResendPasswordDTO) {
    const { token, password } = resetDTO;
    const decoded = await this.jwtService.verifyAsync(token);
    if(!decoded) throw new BadRequestException('Token Expried')
    const hash = await bcrypt.hash(password, 0)
    const updatedUser = await this.userService.update({_id: decoded.id}, {password: hash})
    if(!updatedUser) throw new BadRequestException('error updating user password');
    const authToken = await this.jwtService.sign({
      id: updatedUser._id
    })
    return {
      data: {
        user: updatedUser,
        token: authToken
      }
    }
  }

}



