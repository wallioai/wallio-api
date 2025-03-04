import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './entities/token.entity';
import { FilterQuery, Model } from 'mongoose';
import { NetworkService } from 'src/network/network.service';
import { ethers } from 'ethers';
import { getRpc } from 'src/utils/helpers';

@Injectable()
export class TokenService implements OnModuleInit {
  constructor(
    @InjectModel(Token.name) private model: Model<Token>,
    private readonly networkService: NetworkService,
  ) {}

  async onModuleInit() {
    // const b = await this.getERC20Balance(
    //   '0x691889F5944126906F0051c5ca087e975BADABb3',
    // );
    // console.log(b);
    // const provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org');

    // console.log(`🔍 Fetching balances on Binance ...`);

    // const logs = await provider.getLogs({
    //   address: '0x691889F5944126906F0051c5ca087e975BADABb3',
    //   fromBlock: 0n,
    //   toBlock: 'latest',
    //   topics: [[ethers.id('Transfer(address,address,uint256)')]],
    // });
    // console.log(logs)
  }

  create(createTokenDto: CreateTokenDto) {
    return this.model.create(createTokenDto);
  }

  batchCreate(createTokenDto: CreateTokenDto[]) {
    return this.model.insertMany(createTokenDto);
  }

  findAll(filter: FilterQuery<Token>) {
    return this.model.find(filter);
  }

  findOne(filter: FilterQuery<Token>) {
    return this.model.findOne(filter);
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }

  async getERC20Balance(walletAddress: string) {
    const networks = await this.networkService.findAll();

    for (const network of networks) {
      if (!network.rpcUrls) return;

      try {
        const rpc = getRpc(network.rpcUrls);
        const provider = new ethers.JsonRpcProvider(rpc);
        const multicall = network.multicallAddress;

        console.log(`🔍 Fetching balances on ${network.name}...`);

        const logs = await provider.getLogs({
          address: walletAddress,
          fromBlock: 0n,
          toBlock: 'latest',
          topics: [[ethers.id('Transfer(address,address,uint256)')]],
        });
        console.log(logs);

        const tokenAddresses = [
          ...new Set(logs.map((log) => log.address.toLowerCase())),
        ];

        console.log(tokenAddresses);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
