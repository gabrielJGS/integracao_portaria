import { CreateBoletoDto } from '../dto/create-boleto.dto';

const fs = require('fs');
const csv = require('fast-csv');

const readCSV = async (filePath: string): Promise<CreateBoletoDto[]> => {
  const readStream = fs.createReadStream(filePath);
  const data: CreateBoletoDto[] = [];
  await readStream
    .pipe(csv.parse())
    .on('data', (row: string) => {
      const col = row[0].split(';');
      data.push({
        nome: col[0],
        unidade: col[1],
        valor: +col[2],
        linha_digitavel: col[3],
      });
    })
    .on('end', () => {
      data.shift();
    })
    .on('error', (error: any) => console.error(error));
  return data;
};

export { readCSV };
