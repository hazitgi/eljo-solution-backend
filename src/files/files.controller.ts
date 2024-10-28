import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  @Post('upload/:qcTaskId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/images', // Destination folder for uploaded files
        filename: (req, file, callback) => {
          const qcTaskId = req.params.qcTaskId; // Get qcTaskId from route params
          const filename = `${qcTaskId}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('qcTaskId') qcTaskId: string,
  ) {
    return {
      url: `http://localhost:3000/static/images/${qcTaskId}-${file.filename}`,
    };
  }
}
