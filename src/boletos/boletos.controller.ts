import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Express } from 'express';
import csvConfig from './utils/multer-config';
import { parseFileConfig } from './utils/parse-config';
import { readCSV } from './utils/file-reader';

@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', csvConfig))
  async create(
    @UploadedFile(parseFileConfig)
    file: Express.Multer.File,
  ) {
    const csv = await readCSV(file.path);
    return this.boletosService.create(csv);
  }

  @Get()
  findAll() {
    return this.boletosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boletosService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boletosService.remove(+id);
  }
}
