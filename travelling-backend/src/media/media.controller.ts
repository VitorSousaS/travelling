import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  ServiceUnavailableException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { StorageService } from '../storage/storage.service';
import { StorageFile } from '../storage/dto/create-storage.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';

@ApiTags('MediaUpload')
@Controller('media')
export class MediaController {
  constructor(private storageService: StorageService) {}

  @IsPublic()
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mediaId: { type: 'string' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({
    summary: 'Serviço para fazer upload de arquivo na GCP passando um mediaId.',
  })
  async uploadMedia(@UploadedFiles() files: Express.Multer.File[]) {
    const result = [];

    for (const file of files) {
      const posfix = Date.now();
      const path = `media/${file.originalname}${posfix}`;

      await this.storageService.save(path, file.mimetype, file.buffer, [
        { mediaId: file.originalname, contentType: file.mimetype },
      ]);

      // Gerar URL pública autenticada usando StorageService
      const url = await this.storageService.getSignedUrl(path);

      result.push({ url });
    }

    // Retorna uma ou mais URLs das imagens enviadas
    if (result.length === 1) return result[0];

    return result;
  }

  // @Roles('AGENCY', 'BUSINESS')
  @IsPublic()
  @Get(':mediaId')
  @ApiOperation({
    summary:
      'Serviço para buscar um arquivo na GCP por um mediaId e retornar o link.',
  })
  async getMedia(@Param('mediaId') mediaId: string) {
    try {
      const url = await this.storageService.getSignedUrl('media/' + mediaId);
      return { url };
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException('image not found');
      } else {
        throw new ServiceUnavailableException('internal error');
      }
    }
  }

  // @Roles('AGENCY', 'BUSINESS')
  @IsPublic()
  @Get('/download/:mediaId')
  @ApiOperation({
    summary:
      'Serviço para buscar um arquivo na GCP por um mediaId e retornar o arquivo.',
  })
  async downloadMedia(@Param('mediaId') mediaId: string, @Res() res: Response) {
    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.getWithMetaData(
        'media/' + mediaId,
      );
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException('image not found');
      } else {
        throw new ServiceUnavailableException('internal error');
      }
    }
    res.setHeader('Content-Type', storageFile.contentType);
    res.setHeader('Cache-Control', 'max-age=60d');
    res.end(storageFile.buffer);
  }

  @Delete('/:mediaId')
  @Roles('AGENCY', 'BUSINESS')
  @ApiOperation({
    summary: 'Serviço para deletar arquivo na GCP passando um mediaId.',
  })
  async remove(@Param('mediaId') mediaId: string) {
    return this.storageService.remove(mediaId);
  }
}
