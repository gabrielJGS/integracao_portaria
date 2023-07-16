import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Express } from 'express';
import { csvConfig, pdfConfig } from './utils/multer-config';
import { parseFileConfig, parsePdfConfig } from './utils/parse-config';
import { readCSV, readPDF } from './utils/file-reader';
import { ApiQuery, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { writePDF } from './utils/file-writer';

@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', csvConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @UploadedFile(parseFileConfig)
    file: Express.Multer.File,
  ) {
    const csv = await readCSV(file.path);
    return this.boletosService.create(csv);
  }

  @Get()
  @ApiQuery({
    name: 'relatorio',
    description: 'Retorna o resultado em um pdf',
    required: false,
    example: '0',
  })
  @ApiQuery({
    name: 'id_lote',
    description: 'Busca pelo id do lote informado',
    required: false,
  })
  @ApiQuery({
    name: 'valor_final',
    description: 'Busca pelo valor menor ou igual ao informado',
    required: false,
  })
  @ApiQuery({
    name: 'valor_inicial',
    description: 'Busca pelo valor maior ou igual ao informado',
    required: false,
  })
  @ApiQuery({
    name: 'nome',
    description: 'Busca pelo nome, usar entre % para like',
    required: false,
  })
  async findAll(
    @Query('nome') nome: string | null = null,
    @Query('valor_inicial') valor_inicial: number | null = null,
    @Query('valor_final') valor_final: number | null = null,
    @Query('id_lote') id_lote: number | null = null,
    @Query('relatorio') relatorio: number = 0,
  ) {
    const rel = await this.boletosService.findAll(
      nome,
      valor_inicial,
      valor_final,
      id_lote,
    );
    if (+relatorio === 1) return { base64: await writePDF(rel) };
    return rel;
  }

  @Post('/pdf')
  @UseInterceptors(FileInterceptor('file', pdfConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async parsePdfs(
    @UploadedFile(parsePdfConfig)
    file: Express.Multer.File,
  ) {
    const boletosPdf = await readPDF(file.path);
    const names = boletosPdf.map((bol) => {
      return bol.nome!;
    });
    if (!names || names === undefined)
      return `Nenhum nome foi encontrado no pdf`;
    const boletosDB = await this.boletosService.getBoletosByNames(names);
    const boletosMerged = boletosPdf.map((bol) => {
      if (!bol.id) {
        const merge = boletosDB.find((bDb) => {
          return bDb.nome_sacado === bol.nome;
        });
        // O objeto abaixo sempre vai existir, já q foi buscado por nome no DB
        bol.id = merge!.id;
      }
      return bol;
    });
    return writePDF(boletosMerged);
  }
}
