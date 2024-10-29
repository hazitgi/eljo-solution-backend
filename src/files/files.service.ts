import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { createReadStream } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { File } from '../entities/file.entity';
import { QCChecklist } from '../entities/qc-checklist.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private readonly uploadDir: string;

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(QCChecklist)
    private readonly checklistRepository: Repository<QCChecklist>,
    private readonly configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private async generateUniqueFilename(originalname: string): Promise<string> {
    const ext = path.extname(originalname);
    const uuid = uuidv4();
    return `${uuid}${ext}`;
  }

  async saveFile(
    fileData: { 
      buffer: Buffer; 
      originalname: string; 
      mimetype: string; 
      size: number 
    },
    checklistId: number,
  ): Promise<File> {
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
    });

    if (!checklist) {
      throw new NotFoundException(`Checklist with id ${checklistId} not found`);
    }

    const filename = await this.generateUniqueFilename(fileData.originalname);
    const filePath = path.join(this.uploadDir, filename);

    // Write file using fs.promises.writeFile
    await fs.writeFile(filePath, fileData.buffer);

    const fileEntity = this.fileRepository.create({
      filename,
      originalname: fileData.originalname,
      mimetype: fileData.mimetype,
      size: fileData.size,
      path: filePath,
      checklist: { id: checklistId },
    });

    return this.fileRepository.save(fileEntity);
  }

  async getFileById(id: number): Promise<File> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return file;
  }

  async streamFileToResponse(file: File, response: Response): Promise<void> {
    try {
      await fs.access(file.path);
      const fileStream = createReadStream(file.path);
      return new Promise((resolve, reject) => {
        fileStream.pipe(response)
          .on('finish', resolve)
          .on('error', reject);
      });
    } catch (error) {
      throw new NotFoundException('File not found on disk');
    }
  }

  async removeFile(id: number): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }

    try {
      await fs.unlink(file.path);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw new Error('Failed to delete physical file');
      }
    }

    await this.fileRepository.remove(file);
  }
}