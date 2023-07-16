import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

const parseFileConfig = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 10000 }),
    new FileTypeValidator({ fileType: 'text/csv' }),
  ],
});

const parsePdfConfig = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 5000*10000 }),
    new FileTypeValidator({ fileType: 'application/pdf' }),
  ],
});

export { parseFileConfig, parsePdfConfig };
