import { Injectable } from '@nestjs/common';
import { CreateBoletoDto } from './dto/create-boleto.dto';

@Injectable()
export class BoletosService {
  create(createBoletoDto: CreateBoletoDto) {
    return 'This action adds a new boleto';
  }

  findAll() {
    return `This action returns all boletos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boleto`;
  }
  
  remove(id: number) {
    return `This action removes a #${id} boleto`;
  }
}
