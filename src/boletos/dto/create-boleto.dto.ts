import { ApiProperty } from '@nestjs/swagger';

export class CreateBoletoDto {
  @ApiProperty()
  nome: string;
  @ApiProperty()
  unidade: string;
  @ApiProperty()
  valor: number;
  @ApiProperty()
  linha_digitavel: string;
}
