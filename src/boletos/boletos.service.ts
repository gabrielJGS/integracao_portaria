import { Injectable, Inject } from '@nestjs/common';
import { CreateBoletoDto } from './dto/create-boleto.dto';

import { Lote } from './entities/lote.entity';
import { Boleto } from './entities/boleto.entity';
import { DePara } from './entities/depara.entity';

@Injectable()
export class BoletosService {
  constructor(
    @Inject('LOTES_REPOSITORY')
    private lotesRepository: typeof Lote,
    @Inject('BOLETOS_REPOSITORY')
    private boletosRepository: typeof Boleto,
    @Inject('DEPARA_REPOSITORY')
    private deParaRepository: typeof DePara,
  ) {}
  async create(createBoletoDto: CreateBoletoDto[]) {
    // Monta um array/map com as equivalencias entre os sistemas
    const de_paras = await this.deParaRepository.findAll<DePara>({ raw: true });
    const array_depara: any = [];
    de_paras.map((depara) => {
      array_depara[depara.nome_lote] = depara.id;
    });

    const boletos = await Promise.all(
      createBoletoDto.map(async (bols): Promise<Boleto> => {
        const id_lote = array_depara[bols.unidade];
        if (!id_lote) throw new Error('ID_LOTE Integração não cadastrado');

        // Verifica se existe e cria o lote caso não exista anteriormente
        const lote = await this.lotesRepository.findOne({
          where: { id: id_lote },
        });
        if (!lote) {
          await this.lotesRepository.create({
            id: id_lote,
            nome: bols.nome,
            ativo: true,
            criado_em: new Date().toISOString(),
          });
        }

        return await this.boletosRepository
          .create<Boleto>({
            nome_sacado: bols.nome,
            id_lote: id_lote,
            valor: bols.valor,
            linha_digitavel: bols.linha_digitavel,
            ativo: true,
            criado_em: new Date().toISOString(),
          })
          .catch((err) => {
            throw new Error(`Erro ao cadastrar novo boleto:\n${err}`);
          });
      }),
    );

    return boletos;
  }

  findAll() {
    return this.boletosRepository.findAll<Boleto>();
  }

  findOne(id: number) {
    return `This action returns a #${id} boleto`;
  }

  remove(id: number) {
    return `This action removes a #${id} boleto`;
  }
}
