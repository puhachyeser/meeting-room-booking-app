import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MeetingRoom } from './room.entity';

export enum RoomRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('room_members')
export class RoomMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: RoomRole, default: RoomRole.USER })
  role: RoomRole;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => MeetingRoom, (room) => room.members, { onDelete: 'CASCADE' })
  room: MeetingRoom;
}
