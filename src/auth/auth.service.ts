import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, CreateVendorDto, AuthenticateDto } from './dto';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as argon from 'argon2';
import config from '../config/environment/env.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async authenticateUser(dto: CreateUserDto) {
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

      return {
        message: 'User record saved',
        statusCode: 201,
        status: 'success',
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

      // TODO: ADD MAIL SENDING

      return {
        message: 'Admin account created. Please verify your account',
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

      // TODO: SEND VERIFICATION TOKEN AS LINK TO USER EMAIL

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
        user.role !== 'superadmin'
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

      const payload = {
        sub: user.user_id,
        username: user.user_name,
        email: user.email,
        role: user.role,
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
    } catch (error) {}
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
    } catch (error) {}
  }
}
