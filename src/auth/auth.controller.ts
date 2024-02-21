import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthenticateDto,
  CreateUserDto,
  CreateVendorDto,
  ResetPasswordDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  user(@Body() dto: any) {
    return this.authService.user(dto);
  }

  @Post('/admin')
  registerAdmin(@Body() dto: CreateUserDto) {
    return this.authService.registerAdmin(dto);
  }

  @Get('/admin/verify')
  verifyAdmin(@Query('token') token: string) {
    return this.authService.verifyAdmin(token);
  }

  @Post('/vendor')
  registerVendor(@Body() dto: CreateVendorDto) {
    return this.authService.registerVendor(dto);
  }

  @Post('/login/admin')
  loginAdmin(@Body() dto: AuthenticateDto) {
    return this.authService.authenticateAdmin(dto);
  }

  @Post('/login/vendor')
  loginVendor(@Body() dto: AuthenticateDto) {
    return this.authService.authenticateVendor(dto);
  }

  @Get('/vendor/verify')
  verifyEmailVendor(@Query('token') token: string) {
    return this.authService.verifyEmailVendor(token);
  }

  @Post('/vendor/forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('/vendor/reset-password')
  resetPassword(@Query('token') token: string, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(token, dto);
  }
}
