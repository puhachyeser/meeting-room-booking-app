import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MeetingRoom } from './entities/room.entity';
import { RoomMember } from './entities/room-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom, RoomMember])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
