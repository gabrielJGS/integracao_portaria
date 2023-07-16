import { CreateBoletoDto } from '../dto/create-boleto.dto';
import { IBoleto } from '../models/boleto.model';
const pdf = require('pdf-parse');

const fs = require('fs');
const csv = require('fast-csv');

const readCSV = async (filePath: string): Promise<CreateBoletoDto[]> => {
  return new Promise(async (resolve, reject) => {
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
        resolve(data);
      })
      .on('error', (error: any) => reject(error));
    return data;
  });
};

const readPDF = async (filePath: string): Promise<IBoleto[]> => {
  return new Promise((resolve, reject) => {
    let dataBuffer = fs.readFileSync(filePath);

    pdf(dataBuffer)
      .then((data: any) => {
        const pages: any = [];
        const text = data.text.split('\n');
        let obj = new IBoleto();
        text.forEach((row: string) => {
          if (row == '' || row == ' ') return;

          if (row.includes('nome:')) obj.nome = row.replace('nome:', '').trim();
          if (row.includes('unidade:'))
            obj.unidade = +row.replace('unidade:', '').trim();
          if (row.includes('valor:'))
            obj.valor = +row.replace('valor:', '').trim();
          if (row.includes('linha_digitavel:')) {
            obj.linha_digitavel = row.replace('linha_digitavel:', '').trim();
            pages.push(obj);
            obj = new IBoleto();
          }
        });
        resolve(pages);
      })
      .catch((e: any) => {
        reject(e);
      });
  });
};

export { readCSV, readPDF };
