import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsEmail({}, { message: 'Wrong email format' })
  email: string;

  @MinLength(6, { message: 'Password must contain at least 6 characters' })
  password: string;
}
