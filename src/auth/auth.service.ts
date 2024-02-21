import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUserDto,
  CreateVendorDto,
  AuthenticateDto,
  ResetPasswordDto,
} from './dto';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as argon from 'argon2';
import config from '../config/environment/env.config';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailData } from 'src/email/email.entity';
import { UserEntity } from 'src/common/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async user(dto: CreateUserDto) {
    try {
      let newUser = await this.prisma.users.findUnique({
        where: {
          google_id: dto.google_id,
        },
      });

      if (!newUser) {
        newUser = await this.prisma.users.create({
          data: dto,
        });

        if (!newUser) {
          throw new InternalServerErrorException(
            'User could not be registered',
          );
        }
      }

      const payload: UserEntity = {
        sub: newUser.user_id,
        username: newUser.user_name,
        email: newUser.email,
        role: [newUser.role.toLowerCase()],
      };

      const token = await this.jwt.signAsync(payload, {
        secret: config.JWT_SECRET,
      });

      return {
        message: 'User record saved',
        statusCode: 201,
        status: 'success',
        token,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'There is a unique constraint violation, ensure that email, phone_number and google_id are unique',
          );
        }
      }
      console.error(error);
      throw error;
    }
  }

  async registerAdmin(dto: CreateUserDto) {
    try {
      const password = await argon.hash(dto.password);
      const verificationToken = randomBytes(12).toString('hex');
      if (!config.adminMail.includes(dto.email)) {
        throw new UnauthorizedException('Please provide an admin mail');
      }

      const user = await this.prisma.users.create({
        data: {
          user_name: dto.user_name,
          email: dto.email,
          phone_number: dto.phone_number,
          password: password,
          verificationToken,
          role: 'superadmin',
        },
      });

      const data: EmailData = {
        to: user.email,
        data: {
          username: user.user_name,
          url: `${config.URL}/auth/admin/verify?token=${user.verificationToken}`,
        },
      };

      // TODO: ADD MAIL SENDING
      this.eventEmitter.emit('admin.register', data);

      return {
        message: 'Admin account created. Please verify your account',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            `Unique constraint violation. Ensure ${error.meta.target[0]} is unique`,
          );
        }
      }
      throw error;
    }
  }

  async verifyAdmin(token: string) {
    try {
      const admin = await this.prisma.users.update({
        where: {
          verificationToken: token,
        },
        data: {
          verified: true,
        },
      });

      const data: EmailData = {
        to: admin.email,
        data: {
          username: admin.user_name,
        },
      };

      // TODO: Send verification email
      this.eventEmitter.emit('admin.verify', data);

      return {
        message: 'Admin account verified',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async registerVendor(dto: CreateVendorDto) {
    try {
      const verificationToken = randomBytes(12).toString('hex');
      const password = await argon.hash(dto.password);
      const vendor = await this.prisma.vendors.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: password,
          phone_number: dto.phone_number,
          business_address: dto.business_address,
          verificationToken,
        },
      });

      const data: EmailData = {
        to: vendor.email,
        data: {
          username: vendor.name,
          url: `${config.URL}/auth/vendor/verify?token=${vendor.verificationToken}`,
        },
      };

      // TODO: SEND VERIFICATION TOKEN AS LINK TO USER EMAIL
      this.eventEmitter.emit('register.vendor', data);

      return {
        message: 'Registration successful, verification token sent to email',
        status: 'success',
        statusCode: 201,
      };
    } catch (error) {
      console.log(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('unique field violation');
        }
      }
      throw error;
    }
  }

  async authenticateAdmin(dto: AuthenticateDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new NotFoundException('User with email not found');
      }

      if (
        !config.adminMail.includes(user.email) &&
        user.role.toLowerCase() !== 'superadmin'
      ) {
        throw new ForbiddenException(
          'User with email does not have privileges to use this route.',
        );
      }

      if (!user.verified) {
        const verificationToken = randomBytes(12).toString('hex');
        await this.prisma.users.update({
          where: {
            email: user.email,
          },
          data: {
            verificationToken: verificationToken,
          },
        });

        // TODO: EMIT EMAIL

        return {
          message:
            'Verification token sent to your email. Please verify your account',
          status: 'success',
          statusCode: 200,
        };
      }

      const match = await argon.verify(user.password, dto.password);

      if (!match) {
        throw new ForbiddenException('Invalid password');
      }

      const payload: UserEntity = {
        sub: user.user_id,
        username: user.user_name,
        email: user.email,
        role: [user.role.toLowerCase()],
      };

      const token = await this.jwt.signAsync(payload, {
        secret: config.JWT_SECRET,
      });

      return {
        access_token: token,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async authenticateVendor(dto: AuthenticateDto) {
    try {
      const vendor = await this.prisma.vendors.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!vendor) {
        throw new NotFoundException('Vendor with email not found');
      }

      if (!vendor.verified) {
        const verificationToken = await this.jwt.sign(
          { sub: vendor.vendor_id },
          {
            secret: config.JWT_SECRET,
            expiresIn: '1h',
          },
        );

        await this.prisma.vendors.update({
          where: {
            email: vendor.email,
          },
          data: {
            verificationToken: verificationToken,
          },
        });

        // TODO: SEND VERIFICATION EMAIL

        return {
          message: 'Verification email sent',
          status: 'success',
          statusCode: 200,
        };
      }

      const payload: UserEntity = {
        sub: vendor.vendor_id,
        email: vendor.email,
        username: vendor.name,
        role: ['vendor'],
      };

      const token = await this.jwt.signAsync(payload, {
        secret: config.JWT_SECRET,
        expiresIn: '3h',
      });

      return {
        access_token: token,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async verifyEmailVendor(token: string) {
    try {
      const vendor = await this.prisma.vendors.update({
        where: {
          verificationToken: token,
        },
        data: {
          verified: true,
          verificationToken: undefined,
        },
      });

      if (!vendor) {
        throw new InternalServerErrorException('Vendor could not be updated');
      }

      return {
        message: 'Account verified successfully',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async forgotPassword(email: string) {
    try {
      const vendor = await this.prisma.vendors.findUnique({
        where: {
          email: email,
        },
      });

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      const payload = {
        sub: vendor.vendor_id,
        username: vendor.name,
        email: vendor.email,
      };

      const token = await this.jwt.signAsync(payload, {
        secret: config.RESET_SECRET,
        expiresIn: '30m',
      });

      await this.prisma.vendors.update({
        where: {
          email: email,
        },
        data: {
          resetToken: token,
        },
      });

      const data: EmailData = {
        to: vendor.email,
        data: {
          username: vendor.name,
          url: `${config.URL}/auth/vendor/forgot-password`,
        },
      };

      // TODO: SEND RESET TOKEN TO USER EMAIL
      this.eventEmitter.emit('vendors.forgot-password', data);

      return {
        message: 'Reset Link sent to email',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async resetPassword(token: string, dto: ResetPasswordDto) {
    try {
      const decode = await this.jwt.verifyAsync(token, {
        secret: config.RESET_SECRET,
      });

      if (!decode) {
        throw new ForbiddenException('Invalid Reset token sent');
      }

      const password = await argon.hash(dto.password);

      const vendor = await this.prisma.vendors.update({
        where: {
          vendor_id: decode.sub,
          email: decode.email,
        },
        data: {
          password: password,
        },
      });

      if (!vendor) {
        throw new InternalServerErrorException('Password could not be reset');
      }

      const data: EmailData = {
        to: vendor.email,
        data: {
          username: vendor.name,
        },
      };
      // TODO: SEND PASSWORD RESET EMAIL
      this.eventEmitter.emit('vendors.reset-password', data);

      return {
        message: 'Password reset successfully',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
