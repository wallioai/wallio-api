import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { BridgeService } from './bridge.service';
import { CreateBridgeDto } from './dto/create-bridge.dto';
import { UpdateBridgeDto } from './dto/update-bridge.dto';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { DebridgeService } from './debridge/debridge.service';

@Controller('bridge')
export class BridgeController {
  constructor(
    private readonly bridgeService: BridgeService,
    private readonly deBridgeService: DebridgeService,
    private readonly http: HttpService,
  ) {}

  @Post()
  create(@Body() createBridgeDto: CreateBridgeDto) {
    return this.bridgeService.create(createBridgeDto);
  }

  @Get('fetch-quotes')
  async fetchQuotes(
    @Req() req: Request,
    @Query('srcChain') srcChain: number,
    @Query('srcToken') srcToken: string,
    @Query('dstChain') dstChain: number,
    @Query('dstToken') dstToken: string,
    @Query('sender') sender: string,
    @Query('recipient') recipient: string,
    @Query('amount') amount: string,
  ) {
    
    return this.bridgeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bridgeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBridgeDto: UpdateBridgeDto) {
    return this.bridgeService.update(+id, updateBridgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bridgeService.remove(+id);
  }
}
