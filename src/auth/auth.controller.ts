import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthenticateDto,
  CreateUserDto,
  CreateVendorDto,
  ResetPasswordDto,
} from './dto';
import { Public } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  user(@Body() dto: any) {
    return this.authService.user(dto);
  }

  @Post('/admin')
  @Public()
  registerAdmin(@Body() dto: CreateUserDto) {
    return this.authService.registerAdmin(dto);
  }

  @Get('/admin/verify')
  @Public()
  verifyAdmin(@Query('token') token: string) {
    return this.authService.verifyAdmin(token);
  }

  @Post('/vendor')
  @Public()
  registerVendor(@Body() dto: CreateVendorDto) {
    return this.authService.registerVendor(dto);
  }

  @Post('/login/admin')
  @Public()
  loginAdmin(@Body() dto: AuthenticateDto) {
    return this.authService.authenticateAdmin(dto);
  }

  @Post('/login/vendor')
  @Public()
  loginVendor(@Body() dto: AuthenticateDto) {
    return this.authService.authenticateVendor(dto);
  }

  @Get('/vendor/verify')
  @Public()
  verifyEmailVendor(@Query('token') token: string) {
    return this.authService.verifyEmailVendor(token);
  }

  @Post('/vendor/forgot-password')
  @Public()
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('/vendor/reset-password')
  @Public()
  resetPassword(@Query('token') token: string, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(token, dto);
  }
}
