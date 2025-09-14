import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { StorageService } from 'src/storage/storage.service';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';
import { User } from '@prisma/client';
import { QueryConfigDto } from 'src/shared/services/dto/utils.dto';
import { UtilsService } from 'src/shared/services/utils.service';
import { FiltersAttractionDto } from './dto/filters-attraction.dto';

@Injectable()
export class AttractionService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private utils: UtilsService,
  ) {}

  async create(data: CreateAttractionDto, user: User, agencyId: string) {
    const attractionExists = await this.prisma.attraction.findFirst({
      where: {
        location: data.location,
      },
    });

    if (attractionExists) {
      throw new Error('Attraction already exists in this location');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== agencyId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const agency = await this.prisma.agency.findUnique({
      where: {
        id: agencyId,
      },
    });

    if (!agency) {
      throw new Error('Agency does not exists');
    }

    const attraction = await this.prisma.attraction.create({
      data: {
        ...data,
        pricing: parseFloat(data.pricing),
        categories: {
          connect: data.categories.map((categoryId) => ({
            id: categoryId,
          })),
        },
        agency: {
          connect: {
            id: agency.id,
          },
        },
      },
    });

    return {
      ...attraction,
      categories: data.categories.map((categoryId) => ({
        id: categoryId,
      })),
    };
  }

  async findAll(filters: FiltersAttractionDto) {
    const queryConfig: QueryConfigDto = {
      name: {
        field: 'name',
        operation: 'contains',
        insensitive: true,
      },
      minPrice: {
        field: 'pricing',
        operation: 'gte',
        transform: (value: string) => parseFloat(value),
      },
      maxPrice: {
        field: 'pricing',
        operation: 'lte',
        transform: (value: string) => parseFloat(value),
      },
      startDate: {
        field: 'date',
        operation: 'gte',
        transform: (value: string) => new Date(value),
      },
      endDate: {
        field: 'date',
        operation: 'lte',
        transform: (value: string) => new Date(value),
      },
      location: {
        field: 'location',
        operation: 'contains',
        insensitive: true,
      },
      averageRating: {
        field: 'averageRating',
        operation: 'gte',
        transform: (value: string) => Number(value),
      },
      categories: {
        field: 'categories',
        operation: 'some',
        transform: (value: string) => ({
          OR: [
            {
              id: {
                in: value.split(','),
              },
            },
            {
              title: {
                in: value.split(','),
              },
            },
          ],
        }),
      },
      interprise: {
        field: 'agency',
        transform: (value: string) => ({
          user: {
            name: { contains: value, mode: 'insensitive' },
          },
        }),
      },
    };

    const [whereLength, where] = this.utils.generateWhereByParams(
      filters,
      queryConfig,
    );

    const attractions = await this.prisma.attraction.findMany({
      where,
      include: {
        categories: true,
        ratings: true,
        agency: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: false,
                phone: false,
              },
            },
          },
        },
      },
    });

    // Passo 2: Obter URLs assinadas para cada mídia
    const updatedAttractions = await Promise.all(
      attractions.map(async (attraction) => {
        // Obter URLs assinadas para a mídia associada
        const bannerSigned = await this.storageService.getSignedUrl(
          'media/' + attraction.banner,
        );

        const mediaWithUrls = await Promise.all(
          attraction.generalMedias.map(async (mediaItem) => {
            const signedUrl = await this.storageService.getSignedUrl(
              'media/' + mediaItem,
            );
            return signedUrl;
          }),
        );

        return {
          ...attraction,
          generalMedias: mediaWithUrls,
          banner: bannerSigned,
        };
      }),
    );

    // Verifique se não foram encontrados atrativos
    if (updatedAttractions.length === 0 && whereLength > 0) {
      throw new NotFoundException(
        'No attractants found with the provided filters.',
      );
    }

    return updatedAttractions;
  }

  async findOne(id: string) {
    const attraction = await this.prisma.attraction.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
        ratings: true,
        agency: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: false,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!attraction) {
      throw new Error('Attraction not found');
    }

    // 2. Obter URLs assinadas para o banner e mídias associadas
    const bannerSigned = await this.storageService.getSignedUrl(
      'media/' + attraction.banner,
    );

    const mediaWithUrls = await Promise.all(
      attraction.generalMedias.map(async (mediaItem) => {
        const signedUrl = await this.storageService.getSignedUrl(
          'media/' + mediaItem,
        );
        return signedUrl;
      }),
    );

    return {
      ...attraction,
      generalMedias: mediaWithUrls,
      banner: bannerSigned,
    };
  }

  async findAttractionsByAgency(agencyId: string) {
    const attractions = await this.prisma.attraction.findMany({
      where: {
        agencyId,
      },
      include: {
        categories: true,
        ratings: true,
        agency: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // Passo 2: Obter URLs assinadas para cada mídia
    const updatedAttractions = await Promise.all(
      attractions.map(async (attraction) => {
        // Obter URLs assinadas para a mídia associada
        const bannerSigned = await this.storageService.getSignedUrl(
          'media/' + attraction.banner,
        );

        const mediaWithUrls = await Promise.all(
          attraction.generalMedias.map(async (mediaItem) => {
            const signedUrl = await this.storageService.getSignedUrl(
              'media/' + mediaItem,
            );
            return signedUrl;
          }),
        );

        return {
          ...attraction,
          generalMedias: mediaWithUrls,
          banner: bannerSigned,
        };
      }),
    );

    return updatedAttractions;
  }

  async update(id: string, user: User, data: UpdateAttractionDto) {
    const attractionExists = await this.prisma.attraction.findFirst({
      where: {
        id,
      },
    });

    if (!attractionExists) {
      throw new Error('Attraction does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== attractionExists.agencyId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const attraction = await this.prisma.attraction.update({
      where: {
        id,
      },
      data: {
        ...data,
        pricing: parseFloat(data.pricing),
        categories: {
          set: data.categories?.map((categoryId) => ({
            id: categoryId,
          })),
        },
        updatedAt: new Date(),
      },
    });

    return attraction;
  }

  async remove(id: string, user: User) {
    const attractionExists = await this.prisma.attraction.findUnique({
      where: {
        id,
      },
    });

    if (!attractionExists) {
      throw new Error('Attraction does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== attractionExists.agencyId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.$transaction(async (tx) => {
      const attraction_deleted = await tx.attraction.delete({
        where: {
          id,
        },
      });

      try {
        // Deleta a imagem na GCP do banner do estabelecimento
        const bannerMediaId = attraction_deleted.banner.split('/media/')[1];
        await this.storageService.remove(bannerMediaId);

        // Deleta as imagens na GCP do carousel de imagens gerais do estabelecimento
        attraction_deleted.generalMedias.forEach(async (path) => {
          const mediaId = path.split('/media/')[1];
          await this.storageService.remove(mediaId);
        });
      } catch (error) {
        console.error('Attraction: Images now found');
      }
    });
  }
}
