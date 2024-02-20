import { Controller } from '@nestjs/common';
import { TimeslotsService } from './timeslots.service';

@Controller('timeslots')
export class TimeslotsController {
  constructor(private readonly timeslotsService: TimeslotsService) {}
}
