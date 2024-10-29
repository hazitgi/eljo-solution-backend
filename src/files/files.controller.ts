import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Res,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FilesService } from './files.service';
import { FileResponseDto } from './dto/file-response.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/_{2,}/g, '_');
  }

  @Post('upload/:checklistId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('checklistId', ParseIntPipe) checklistId: number,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file data provided');
    }

    const sanitizedFilename = this.sanitizeFilename(file.originalname);

    try {
      const savedFile = await this.filesService.saveFile(
        {
          buffer: file.buffer,
          originalname: sanitizedFilename,
          mimetype: file.mimetype,
          size: file.size,
        },
        checklistId,
      );

      return {
        id: savedFile.id,
        filename: savedFile.filename,
        originalname: savedFile.originalname,
        size: savedFile.size,
        mimetype: savedFile.mimetype,
        uploadDate: savedFile.created_at,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to save file');
    }
  }

  @Get('download/:id')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const file = await this.filesService.getFileById(id);

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${file.originalname}"`,
      );
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('X-Content-Type-Options', 'nosniff');

      await this.filesService.streamFileToResponse(file, res);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to download file');
    }
  }

  @Delete(':id')
  async deleteFile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    try {
      await this.filesService.removeFile(id);
      return { message: 'File deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
