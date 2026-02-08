import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Wrong email format' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}
