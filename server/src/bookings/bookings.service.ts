import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RoomsService } from '../rooms/rooms.service';
import { RoomRole } from '../rooms/entities/room-member.entity';
import { User } from '../users/entities/user.entity';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private roomsService: RoomsService,
  ) {}

  async create(dto: CreateBookingDto, userId: number): Promise<Booking> {
    const { roomId, startTime, endTime } = dto;
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }

    const role = await this.roomsService.getMemberRole(roomId, userId);

    if (!role) {
      throw new ForbiddenException('You are not a member of this room');
    }

    if (role !== RoomRole.ADMIN) {
      throw new ForbiddenException(
        'Only admins can create bookings in this room',
      );
    }

    const room = await this.roomsService.findOne(roomId);

    const overlapping = await this.bookingsRepository.findOne({
      where: {
        room: { id: roomId },
        startTime: LessThan(end),
        endTime: MoreThan(start),
      },
    });

    if (overlapping) {
      throw new BadRequestException(
        'This room is already booked for the selected time',
      );
    }

    const booking = this.bookingsRepository.create({
      description: dto.description,
      startTime: start,
      endTime: end,
      room: room,
      user: { id: userId } as User,
    });

    return await this.bookingsRepository.save(booking);
  }

  async findAll() {
    return await this.bookingsRepository.find({
      relations: ['room', 'user'],
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['room', 'user'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(
    id: number,
    dto: UpdateBookingDto,
    userId: number,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    const role = await this.roomsService.getMemberRole(booking.room.id, userId);
    if (role !== RoomRole.ADMIN) {
      throw new ForbiddenException('Only admins can edit bookings');
    }

    if (dto.startTime || dto.endTime) {
      const start = dto.startTime ? new Date(dto.startTime) : booking.startTime;
      const end = dto.endTime ? new Date(dto.endTime) : booking.endTime;

      if (start >= end) {
        throw new BadRequestException('Start time must be before end time');
      }

      const overlapping = await this.bookingsRepository.findOne({
        where: {
          id: Not(id),
          room: { id: booking.room.id },
          startTime: LessThan(end),
          endTime: MoreThan(start),
        },
      });

      if (overlapping) {
        throw new BadRequestException(
          'Room is already booked for the selected time',
        );
      }

      booking.startTime = start;
      booking.endTime = end;
    }

    if (dto.description) booking.description = dto.description;

    return await this.bookingsRepository.save(booking);
  }

  async remove(id: number, userId: number): Promise<{ success: boolean }> {
    const booking = await this.findOne(id);

    const role = await this.roomsService.getMemberRole(booking.room.id, userId);
    if (role !== RoomRole.ADMIN) {
      throw new ForbiddenException('Only admins can cancel bookings');
    }

    await this.bookingsRepository.remove(booking);
    return { success: true };
  }
}
