import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiConsumesFromUrl } from 'src/shared';
import { Public } from 'src/shared/decorater/public.decorator';
import { SignInDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Public()
  @Post('/sign-in')
  @ApiConsumes(ApiConsumesFromUrl)
  async login(@Body() dto: SignInDto) {
    try {
      return await this.service.signIn(dto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Get('/profile')
  @ApiBearerAuth()
  async getProfile(@Req() req) {
    try {
      return await this.service.getProfile(req.user);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
