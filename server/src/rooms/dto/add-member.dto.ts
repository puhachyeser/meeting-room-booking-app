import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { RoomRole } from '../entities/room-member.entity';

export class AddMemberDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsEnum(RoomRole, { message: 'Role must be either admin or user' })
  @IsNotEmpty()
  role: RoomRole;
}
