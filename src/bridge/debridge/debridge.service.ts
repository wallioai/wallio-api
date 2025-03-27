import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrepareDeBridgeQuoteDto } from './dto/debridge-quote.dto';
import { parseUnits } from 'viem';

@Injectable()
export class DebridgeService {
  constructor(private readonly http: HttpService) {}

  async prepareBridgeTransaction(args: PrepareDeBridgeQuoteDto) {
    const orderParam = {
      srcChainId: args.fromChain,
      srcChainTokenIn: args.fromToken,
      dstChainId: args.toChain,
      dstChainTokenOut: args.toToken,
      srcChainTokenInAmount: parseUnits(args.amount, args.fromTokenDecimal),
      srcChainOrderAuthorityAddress: args.sender,
      dstChainTokenOutAmount: 'auto',
      prependOperatingExpense: true,
      dstChainOrderAuthorityAddress: args.receiver,
      dstChainTokenOutRecipient: args.receiver,
      affiliateFeePercent: 0.5,
      affiliateFeeRecipient: process.env.AFFILIATE_ADDRESS,
      referralCode: process.env.REFERRAL_CODE,
    };
  }

  async prepareSwapTransaction() {}
}
