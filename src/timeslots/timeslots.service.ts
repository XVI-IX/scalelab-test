import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TimeslotsService {
  constructor(private prisma: PrismaService) {}

  generateTimeSlot() {
    try {
    } catch (error) {}
  }
}
