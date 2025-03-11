import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Public } from 'src/decorators/public.decorator';
import { HttpService } from '@nestjs/axios';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { NetworkService } from 'src/network/network.service';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  AllCoinList,
  DeBridgeTokens,
  ListCoinsById,
  TokenData,
} from './types/tokens.type';
import { zeroAddress } from 'viem';
import { ConfigService } from '@nestjs/config';

@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly networkService: NetworkService,
    private readonly config: ConfigService,
    private http: HttpService,
  ) {}

  @Post('add')
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokenService.create(createTokenDto);
  }

  @Public()
  @Post('batch/add')
  batchCreate(@Body() createTokenDto: CreateTokenDto[]) {
    return this.tokenService.batchCreate(createTokenDto);
  }

  @CacheTTL(24 * 60 * 60 * 1000)
  @UseInterceptors(CacheInterceptor)
  @Get(':chainId')
  async getTokenByChainId(@Param('chainId') chainId: string) {
    const network = await this.networkService.findOne({
      chainId: parseInt(chainId),
    });
    if (!network) {
      throw new NotFoundException('Chain not supported');
    }

    if (network.type == 'testnet') {
      return this.tokenService.findAll({ chainId: parseInt(chainId) });
    }

    const [coinsInfo, networkTokens, allCoinList] = await Promise.all([
      firstValueFrom(
        this.http.get<TokenData[]>(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              category: network.cgCategoryId,
              order: 'market_cap_desc',
              per_page: 50,
              page: 1,
            },
            headers: {
              'x-cg-demo-api-key': this.config.get('app.coingecko'),
            },
          },
        ),
      ),
      firstValueFrom(
        this.http.get<ListCoinsById[]>(
          `https://tokens.coingecko.com/${network.cgPlatformId}/all.json`,
          {
            headers: {
              'x-cg-demo-api-key': this.config.get('app.coingecko'),
            },
          },
        ),
      ),
      firstValueFrom(
        this.http.get<AllCoinList[]>(
          'https://api.coingecko.com/api/v3/coins/list?include_platform=true',
          {
            headers: {
              'x-cg-demo-api-key': this.config.get('app.coingecko'),
            },
          },
        ),
      ),
    ]);

    const tokens = coinsInfo.data.map((ci) => {
      const ciTokenSymbol = ci.symbol.replace(/[^a-zA-Z]/g, '');
      const matchCoinInfo = allCoinList.data.find(
        (c) => c.id.toLowerCase() == ci.id.toLowerCase(),
      );
      const address = matchCoinInfo.platforms[network.cgPlatformId];

      const isNative =
        ciTokenSymbol.toLowerCase() ===
        network.nativeCurrency.symbol.toLowerCase();

      return {
        platformId: ci.id,
        address: isNative ? zeroAddress : address,
        decimal: 18,
        icon: ci.image,
        name: ci.name,
        symbol: ciTokenSymbol.toUpperCase(),
        chainId: network.chainId,
      };
    });

    return tokens;
  }

  @CacheTTL(7 * 24 * 60 * 60 * 1000)
  @UseInterceptors(CacheInterceptor)
  @Get('debridge/:chainId')
  async getTokensByChainId(@Param('chainId') chainId: string) {
    try {
      const network = await this.networkService.findOne({
        chainId: parseInt(chainId),
      });

      if (!network) {
        throw new NotFoundException('Chain not supported');
      }

      const [tokenList] = await Promise.all([
        firstValueFrom(
          this.http.get<DeBridgeTokens>(
            'https://dln.debridge.finance/v1.0/token-list',
            {
              params: {
                chainId: network.deBridgeId,
              },
            },
          ),
        ),
      ]);

      const tokenObject = tokenList.data.tokens;
      const tokens = Object.keys(tokenObject)
        .map((key) => {
          const value = tokenObject[key];
          return {
            address: value.address,
            decimal: value.decimals,
            icon: value.logoURI,
            name: value.name,
            symbol: value.symbol.toUpperCase(),
            chainId: network.chainId,
          };
        })
        .slice(0, 50);

      console.log(tokens.length);

      return tokens;
    } catch (error) {
      console.log(error);
    }
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
