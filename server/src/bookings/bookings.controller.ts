import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { type RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: RequestWithUser,
  ) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Get()
  findAll(@Query('roomId') roomId?: string) {
    if (roomId) {
      return this.bookingsService.findByRoom(+roomId);
    }
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: RequestWithUser,
  ) {
    return this.bookingsService.update(+id, updateBookingDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.bookingsService.remove(+id, req.user.id);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.bookingsService.join(+id, req.user.id);
  }
}
