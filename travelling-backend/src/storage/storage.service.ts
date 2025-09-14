import { DownloadResponse, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import StorageConfig from './storage-config';
import { StorageFile } from './dto/create-storage.dto';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });

    this.bucket = StorageConfig.mediaBucket;
  }

  // Método para gerar URL assinada
  async getSignedUrl(path: string, expiresInMs: number = 1000 * 60 * 60 * 3) {
    const [files] = await this.storage
      .bucket(this.bucket)
      .getFiles({ prefix: path });

    // Supondo que você queira o primeiro arquivo que corresponder ao prefixo
    if (files.length > 0) {
      const file = files[0];
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresInMs,
      });
      return url;
    }

    return null; // Arquivo não encontrado
    // // Três horas para expirar
    // const file = this.storage.bucket(this.bucket).file({ prefix: path });

    // const [url] = await file.getSignedUrl({
    //   action: 'read',
    //   expires: Date.now() + expiresInMs,
    // });

    // return url;
  }

  async save(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string }[],
  ) {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});

    const file = this.storage.bucket(this.bucket).file(path);

    return new Promise((resolve, reject) => {
      const stream = file.createWriteStream({
        metadata: {
          contentType, // Definir o contentType diretamente no stream
        },
      });

      stream.on('finish', async () => {
        try {
          await file.setMetadata({ metadata: object });
          resolve('File Saved!'); // Concluir após o setMetadata
        } catch (error) {
          console.error('Metadata setting error', error);
          reject(error);
        }
      });

      stream.on('error', (error) => {
        console.error('Stream error', error);
        reject(error);
      });

      stream.end(media); // Finaliza o stream e envia os dados
    });
  }

  async get(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();

    const [buffer] = fileResponse;

    const storageFile = new StorageFile();

    storageFile.buffer = buffer;

    storageFile.metadata = new Map<string, string>();

    return storageFile;
  }

  async getWithMetaData(path: string): Promise<StorageFile> {
    const bucket = this.storage.bucket(this.bucket);

    // Buscar o arquivo pelo nome com prefixo
    const [files] = await bucket.getFiles({ prefix: path });

    if (files.length === 0) {
      throw new Error(
        `Arquivo com o nome ${path} não foi encontrado no bucket.`,
      );
    }

    const file = files[0]; // Supondo que o primeiro arquivo encontrado é o correto.

    // Obter os metadados do arquivo
    const [metadata] = await file.getMetadata();

    // Fazer o download do arquivo de forma autenticada
    const [buffer] = await file.download(); // O SDK autenticará automaticamente se as credenciais estiverem corretas.

    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>(
      Object.entries(metadata || {}).map(([key, value]) => [
        key,
        value as string,
      ]),
    );

    storageFile.contentType = storageFile.metadata.get('contentType');

    return storageFile;
  }

  async remove(path: string) {
    return await this.storage
      .bucket(this.bucket)
      .file('media/' + path)
      .delete();
  }

  async exists(filename: string): Promise<boolean> {
    try {
      const [exists] = await this.storage
        .bucket(this.bucket)
        .file(filename)
        .exists();

      return exists;
    } catch (error) {
      console.error('Erro ao verificar a existência do arquivo:', error);
      throw error;
    }
  }
}
