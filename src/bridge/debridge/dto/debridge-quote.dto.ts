export class PrepareDeBridgeQuoteDto {
  fromChain: number;
  toChain: number;
  fromToken: string;
  fromTokenDecimal: number;
  toToken: string;
  amount: string;
  sender: string;
  receiver: string;
}
