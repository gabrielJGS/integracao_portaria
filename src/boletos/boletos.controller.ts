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
import csvConfig from './utils/multer-config';
import { parseFileConfig } from './utils/parse-config';
import { readCSV } from './utils/file-reader';
import {
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

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
  findAll(
    @Query('nome') nome: string | null = null,
    @Query('valor_inicial') valor_inicial: number | null = null,
    @Query('valor_final') valor_final: number | null = null,
    @Query('id_lote') id_lote: number | null = null,
  ) {
    return this.boletosService.findAll(
      nome,
      valor_inicial,
      valor_final,
      id_lote,
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.boletosService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.boletosService.remove(+id);
  // }
}
