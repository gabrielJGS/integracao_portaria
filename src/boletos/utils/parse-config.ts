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

export { parseFileConfig };
