import { Boleto } from '../entities/boleto.entity';

const PDFDocument = require('pdfkit-table');
const { Base64Encode } = require('base64-stream');

const writePDF = async (relatorio: Boleto[]): Promise<any> => {
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

  const pdf = new PDFDocument();
  const rel = await pdf.table(table);
  pdf.text(rel);
  pdf.end();
  return await toBase64(pdf);
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

export { writePDF };
