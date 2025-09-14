import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreateLocalDto } from './dto/create-local.dto';

@Injectable()
export class LocalService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLocalDto, travellingId?: string) {
    const localReferenceExists = await this.prisma.localReference.findFirst({
      where: {
        AND: [
          {
            travellingId,
          },
          {
            [data.type]: {
              id: data.localId,
            },
          },
          {
            position: data.position,
          },
        ],
      },
    });

    if (localReferenceExists) {
      throw new Error('localReference already exists with this position!');
    }

    const localReference = await this.prisma.localReference.create({
      data: {
        position: data.position,
        type: data.type,
        [data.type]: {
          connect: {
            id: data.localId,
          },
        },
      },
    });

    return localReference;
  }

  async remove(id: string) {
    const localReferenceExists = await this.prisma.localReference.findUnique({
      where: {
        id,
      },
    });

    if (!localReferenceExists) {
      throw new Error('localReference does not exists!');
    }

    return await this.prisma.localReference.delete({
      where: {
        id,
      },
    });
  }
}
