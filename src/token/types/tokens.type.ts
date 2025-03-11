import { Hex } from 'viem';

export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  address: string;
  decimal: number;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | number;
  last_updated: string;
}

interface Coin {
  chainId: number;
  address: Hex;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export interface ListCoinsById {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  tokens: Coin[];
}

export interface AllCoinList {
  id: string;
  symbol: string;
  name: string;
  platforms: {
    [key: string]: string;
  };
}

export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  web_slug: string;
  asset_platform_id: string;
  platforms: {
    [key: string]: string;
  };
}

export interface DeBridgeTokens {
  tokens: {
    [key: string]: {
      symbol: string;
      name: string;
      decimals: number;
      address: string;
      logoURI: string;
      tags: [{ Name: string }];
      eip2612: boolean;
    };
  };
}
