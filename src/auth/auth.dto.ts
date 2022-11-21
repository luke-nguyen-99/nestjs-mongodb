import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsString()
  password: string;
}

export class ConfirmPasswordDto {
  @ApiProperty()
  @MinLength(6)
  password: string;
  @ApiProperty()
  confirmPassword: string;
}
export class SignUpDto extends ConfirmPasswordDto {
  @ApiPropertyOptional()
  fullName?: string;
  @ApiProperty()
  username: string;

  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  phone?: string;
}
