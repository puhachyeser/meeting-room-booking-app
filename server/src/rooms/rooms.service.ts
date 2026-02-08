import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingRoom } from './entities/room.entity';
import { RoomMember, RoomRole } from './entities/room-member.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(MeetingRoom)
    private roomsRepository: Repository<MeetingRoom>,
    @InjectRepository(RoomMember)
    private roomMemberRepository: Repository<RoomMember>,
  ) {}

  private async ensureAdmin(roomId: number, userId: number) {
    const member = await this.roomMemberRepository.findOne({
      where: {
        room: { id: roomId },
        user: { id: userId },
      },
    });

    if (!member || member.role !== RoomRole.ADMIN) {
      throw new ForbiddenException('You dont have admin rights for this room');
    }
  }

  async create(createRoomDto: CreateRoomDto, userId: number) {
    const room = this.roomsRepository.create(createRoomDto);
    const savedRoom = await this.roomsRepository.save(room);

    const member = this.roomMemberRepository.create({
      room: savedRoom,
      user: { id: userId } as User,
      role: RoomRole.ADMIN,
    });
    await this.roomMemberRepository.save(member);

    return {
      ...savedRoom,
      role: RoomRole.ADMIN,
    };
  }

  async findAll() {
    return await this.roomsRepository.find();
  }

  async findOne(id: number) {
    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto, userId: number) {
    await this.ensureAdmin(id, userId);
    const room = await this.findOne(id);
    Object.assign(room, updateRoomDto);
    return await this.roomsRepository.save(room);
  }

  async remove(id: number, userId: number) {
    await this.ensureAdmin(id, userId);
    const room = await this.findOne(id);
    await this.roomsRepository.remove(room);
    return { success: true };
  }
}
