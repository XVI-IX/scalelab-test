import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, CreateVendorDto } from './dto';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import * as argon from 'argon2';
import config from '../config/environment/env.config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // async authenticate(dto: CreateUserDto) {
  //   try {
  //     let newUser = await this.prisma.users.findUnique({
  //       where: {
  //         google_id: dto.google_id,
  //       },
  //     });

  //     if (!newUser) {
  //       newUser = await this.prisma.users.create({
  //         data: dto,
  //       });

  //       if (!newUser) {
  //         throw new InternalServerErrorException(
  //           'User could not be registered',
  //         );
  //       }
  //     }

  //     return {
  //       message: 'User record saved',
  //       statusCode: 201,
  //       status: 'success',
  //     };
  //   } catch (error) {
  //     if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //       if (error.code === 'P2002') {
  //         throw new BadRequestException(
  //           'There is a unique constraint violation, ensure that email, phone_number and google_id are unique',
  //         );
  //       }
  //     }
  //     console.error(error);
  //     throw error;
  //   }
  // }

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
        },
      });
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
}
