import { diskStorage } from 'multer';
import * as path from 'path';

const csvConfig = {
  storage: diskStorage({
    destination: './temp/csv',
    filename: (req, file, cb) => {
      const fileName =
        path.parse(file.originalname).name.replace(/\s/g, '') +
        '-' +
        new Date().getTime();

      const extension = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extension}`);
    },
  }),
};

const pdfConfig = {
  storage: diskStorage({
    destination: './temp/pdf',
    filename: (req, file, cb) => {
      const fileName =
        path.parse(file.originalname).name.replace(/\s/g, '') +
        '-' +
        new Date().getTime();

      const extension = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extension}`);
    },
  }),
};

export { csvConfig, pdfConfig };
