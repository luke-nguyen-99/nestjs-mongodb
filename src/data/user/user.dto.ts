import { ApiPropertyOptional } from '@nestjs/swagger';
import { USER_ROLE } from './user.schema';

export class UserDto {
  @ApiPropertyOptional()
  username: string;
  @ApiPropertyOptional()
  full_name: string;
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  password?: string;
  @ApiPropertyOptional({ enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;
  @ApiPropertyOptional()
  phone?: string;
}
