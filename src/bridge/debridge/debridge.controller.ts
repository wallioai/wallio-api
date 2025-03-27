import { Controller } from '@nestjs/common';
import { DebridgeService } from './debridge.service';

@Controller('debridge')
export class DebridgeController {
  constructor(private readonly debridgeService: DebridgeService) {}
}
