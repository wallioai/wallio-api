import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { NetworkService } from './network.service';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { Public } from 'src/decorators/public.decorator';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('add')
  create(@Body() createNetworkDto: CreateNetworkDto) {
    return this.networkService.create(createNetworkDto);
  }

  @Public()
  @Post('batch/add')
  batchCreate(@Body() batchNetworkDto: CreateNetworkDto[]) {
    return this.networkService.batchCreate(batchNetworkDto);
  }

  @Get('list')
  findAll() {
    console.log('here');
    return this.networkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.networkService.findOne({ _id: id });
  }

  @CacheTTL(7 * 24 * 60 * 60 * 1000)
  @UseInterceptors(CacheInterceptor)
  @Get('chain/:id')
  findByChainId(@Param('id') id: string) {
    return this.networkService.findOne({ chainId: parseInt(id) });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNetworkDto: UpdateNetworkDto) {
    //return this.networkService.update(+id, updateNetworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    //return this.networkService.remove(+id);
  }
}
