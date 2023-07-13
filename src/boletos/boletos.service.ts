import { Injectable, Inject } from '@nestjs/common';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { Boleto } from './entities/boleto.entity';

@Injectable()
export class BoletosService {
  constructor(
    @Inject('BOLETOS_REPOSITORY')
    private boletosRepository: typeof Boleto,
  ) {}
  create(createBoletoDto: CreateBoletoDto) {
    return 'This action adds a new boleto';
  }

  findAll() {
    return this.boletosRepository.findAll<Boleto>({where:{criado_em: '2023-01-08 04:05:06'}});
  }

  findOne(id: number) {
    return `This action returns a #${id} boleto`;
  }

  remove(id: number) {
    return `This action removes a #${id} boleto`;
  }
}
