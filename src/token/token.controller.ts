import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('add')
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokenService.create(createTokenDto);
  }

  @Public()
  @Post('batch/add')
  batchCreate(@Body() createTokenDto: CreateTokenDto[]) {
    console.log(createTokenDto);
    return this.tokenService.batchCreate(createTokenDto);
  }

  @Get(':chainId')
  async getTokenByChainId(@Param('chainId') chainId: string) {
    console.log(chainId);
    const tokens = await this.tokenService.findAll({
      chainId: parseInt(chainId),
    });
    console.log(tokens);
    return tokens;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTokenDto: UpdateTokenDto) {
    return this.tokenService.update(+id, updateTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tokenService.remove(+id);
  }
}
