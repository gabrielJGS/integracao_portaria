import { Boleto } from '../entities/boleto.entity';
import { createWriteStream } from 'fs';
import { IBoleto } from '../models/boleto.model';

const PDFDocument = require('pdfkit');
const PDFTable = require('pdfkit-table');
const { Base64Encode } = require('base64-stream');

const writePDFTable = async (relatorio: Boleto[]): Promise<any> => {
  const table = {
    title: 'Relatório lotes',
    subtitle: 'Integração portaria Green Acesso',
    headers: [
      { label: 'id', property: 'id', width: 20 },
      { label: 'nome_sacado', property: 'nome_sacado', width: 100 },
      { label: 'id_lote', property: 'id_lote', width: 20 },
      { label: 'valor', property: 'valor', width: 30 },
      { label: 'linha_digitavel', property: 'linha_digitavel', width: 85 },
      { label: 'ativo', property: 'ativo', width: 20 },
      { label: 'criado_em', property: 'criado_em', width: 240 },
    ],
    rows: relatorio.map((rel) => {
      return Object.values(rel);
    }),
  };

  const pdf = new PDFTable();
  const rel = await pdf.table(table);
  pdf.text(rel);
  pdf.end();
  return await toBase64(pdf);
};

const writePDF = (relatorio: IBoleto[]): string[] => {
  const paths: string[] = [];
  relatorio.map((rel) => {
    const path = `public/pdf/${rel.id}.pdf`;

    const pdf = new PDFDocument();
    pdf.pipe(createWriteStream(path)); // write to PDF
    pdf.text(`id:${rel.id}`);
    pdf.text(`nome:${rel.nome}`);
    pdf.text(`unidade:${rel.unidade}`);
    pdf.text(`valor:${rel.valor}`);
    pdf.text(`linha_digitavel:${rel.linha_digitavel}`);
    pdf.end();
    paths.push(path);
  });
  return paths;
};

const toBase64 = (doc: any) => {
  return new Promise((resolve, reject) => {
    try {
      const stream = doc.pipe(new Base64Encode());

      let base64Value = '';
      stream.on('data', (chunk: any) => {
        base64Value += chunk;
      });

      stream.on('end', () => {
        resolve(base64Value);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export { writePDFTable, writePDF };
