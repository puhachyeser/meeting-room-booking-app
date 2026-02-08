import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty({ message: 'Room name should not be empty' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
