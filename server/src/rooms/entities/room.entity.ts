import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoomMember } from './room-member.entity';

@Entity('rooms')
export class MeetingRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => RoomMember, (member) => member.room)
  members: RoomMember[];
}
