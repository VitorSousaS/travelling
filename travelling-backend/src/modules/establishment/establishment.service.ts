import {
  HttpException,
  HttpStatus,
  Injectable,
  Next,
  NotFoundException,
} from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { PrismaService } from 'src/database/PrismaService';
import { StorageService } from 'src/storage/storage.service';
import { User } from '@prisma/client';
import { FiltersEstablishmentDto } from './dto/filters-establishment.dto';
import { QueryConfigDto } from 'src/shared/services/dto/utils.dto';
import { UtilsService } from 'src/shared/services/utils.service';

@Injectable()
export class EstablishmentService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private utils: UtilsService,
  ) {}

  async create(data: CreateEstablishmentDto, user: User, businessId: string) {
    const establishmentExists = await this.prisma.establishment.findFirst({
      where: {
        location: data.location,
      },
    });

    if (establishmentExists) {
      throw new Error('Establishment already exists in this location');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== businessId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const business = await this.prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });

    if (!business) {
      throw new Error('Business does not exists');
    }

    const establishment = await this.prisma.establishment.create({
      data: {
        ...data,
        minPrice: parseFloat(data.minPrice),
        maxPrice: parseFloat(data.maxPrice),
        categories: {
          connect: data.categories.map((categoryId) => ({
            id: categoryId,
          })),
        },
        business: {
          connect: {
            id: business.id,
          },
        },
        ratings: {
          create: [
            {
              value: 5,
            },
          ],
        },
      },
    });

    return {
      ...establishment,
      categories: data.categories.map((categoryId) => ({
        id: categoryId,
      })),
    };
  }

  async findAll(filters: FiltersEstablishmentDto) {
    const queryConfig: QueryConfigDto = {
      name: {
        field: 'name',
        operation: 'contains',
        insensitive: true,
      },
      minPrice: {
        field: 'minPrice',
        operation: 'gte',
        transform: (value: string) => parseFloat(value),
      },
      maxPrice: {
        field: 'maxPrice',
        operation: 'lte',
        transform: (value: string) => parseFloat(value),
      },
      openHours: {
        field: 'openHours',
        operation: 'gte',
        transform: (value: string) => new Date(value),
      },
      closeHours: {
        field: 'openHours',
        operation: 'lte',
        transform: (value: string) => new Date(value),
      },
      openDays: {
        field: 'openDays',
        operation: 'hasSome',
        transform: (value: string) => value.split(','),
      },
      averageRating: {
        field: 'averageRating',
        operation: 'gte',
        transform: (value: string) => Number(value),
      },
      location: {
        field: 'location',
        operation: 'contains',
        insensitive: true,
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
    };

    const [whereLength, where] = this.utils.generateWhereByParams(
      filters,
      queryConfig,
    );

    const establishments = await this.prisma.establishment.findMany({
      where,
      include: {
        categories: true,
        ratings: true,
        business: {
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
    const updatedEstablishments = await Promise.all(
      establishments.map(async (establishment) => {
        // Obter URLs assinadas para a mídia associada
        const bannerSigned = await this.storageService.getSignedUrl(
          'media/' + establishment.banner,
        );

        const mediaWithUrls = await Promise.all(
          establishment.generalMedias.map(async (mediaItem) => {
            const signedUrl = await this.storageService.getSignedUrl(
              'media/' + mediaItem,
            );
            return signedUrl;
          }),
        );

        const menuMediaUrls = await Promise.all(
          establishment.menuOfServicesMedia.map(async (mediaItem) => {
            const signedUrl = await this.storageService.getSignedUrl(
              'media/' + mediaItem,
            );
            return signedUrl;
          }),
        );

        return {
          ...establishment,
          generalMedias: mediaWithUrls,
          menuOfServicesMedia: menuMediaUrls,
          banner: bannerSigned,
        };
      }),
    );

    // Verifique se não foram encontrados atrativos
    if (updatedEstablishments.length === 0 && whereLength > 0) {
      throw new NotFoundException(
        'No establishments found with the provided filters.',
      );
    }

    return updatedEstablishments;
  }

  async findOne(id: string) {
    const establishment = await this.prisma.establishment.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
        ratings: true,
        business: {
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

    if (!establishment) {
      throw new Error('Establishment not found');
    }

    // 2. Obter URLs assinadas para o banner e mídias associadas
    const bannerSigned = await this.storageService.getSignedUrl(
      'media/' + establishment.banner,
    );

    const mediaWithUrls = await Promise.all(
      establishment.generalMedias.map(async (mediaItem) => {
        const signedUrl = await this.storageService.getSignedUrl(
          'media/' + mediaItem,
        );
        return signedUrl;
      }),
    );

    const menuMediaUrls = await Promise.all(
      establishment.menuOfServicesMedia.map(async (mediaItem) => {
        const signedUrl = await this.storageService.getSignedUrl(
          'media/' + mediaItem,
        );
        return signedUrl;
      }),
    );

    return {
      ...establishment,
      generalMedias: mediaWithUrls,
      menuOfServicesMedia: menuMediaUrls,
      banner: bannerSigned,
    };
  }

  async findEstablishmentByBusiness(businessId: string) {
    const establishments = await this.prisma.establishment.findMany({
      where: {
        businessId,
      },
      include: {
        categories: true,
      },
    });

    // Passo 2: Obter URLs assinadas para cada mídia
    const updatedEstablishments = await Promise.all(
      establishments.map(async (establishment) => {
        // Obter URLs assinadas para a mídia associada
        const bannerSigned = await this.storageService.getSignedUrl(
          'media/' + establishment.banner,
        );

        const mediaWithUrls = await Promise.all(
          establishment.generalMedias.map(async (mediaItem) => {
            const signedUrl = await this.storageService.getSignedUrl(
              'media/' + mediaItem,
            );
            return signedUrl;
          }),
        );

        const menuMediaUrls = await Promise.all(
          establishment.menuOfServicesMedia.map(async (mediaItem) => {
            const signedUrl = await this.storageService.getSignedUrl(
              'media/' + mediaItem,
            );
            return signedUrl;
          }),
        );

        return {
          ...establishment,
          generalMedias: mediaWithUrls,
          menuOfServicesMedia: menuMediaUrls,
          banner: bannerSigned,
        };
      }),
    );

    return updatedEstablishments;
  }

  async update(id: string, user: User, data: UpdateEstablishmentDto) {
    const establishmentExists = await this.prisma.establishment.findFirst({
      where: {
        id,
      },
    });

    if (!establishmentExists) {
      throw new Error('Establishment does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (
      user.id !== establishmentExists.businessId &&
      user.userRole !== 'ADMIN'
    ) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const establishment = await this.prisma.establishment.update({
      where: {
        id,
      },
      data: {
        ...data,
        minPrice: parseFloat(data.minPrice),
        maxPrice: parseFloat(data.maxPrice),
        categories: {
          set: data.categories?.map((categoryId) => ({
            id: categoryId,
          })),
        },
        updatedAt: new Date(),
      },
    });

    return establishment;
  }

  async remove(id: string, user: User) {
    const establishmentExists = await this.prisma.establishment.findUnique({
      where: {
        id,
      },
    });

    if (!establishmentExists) {
      throw new Error('Establishment does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (
      user.id !== establishmentExists.businessId &&
      user.userRole !== 'ADMIN'
    ) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.$transaction(async (tx) => {
      const establishment_deleted = await tx.establishment.delete({
        where: {
          id,
        },
      });

      try {
        // Deleta a imagem na GCP do banner do estabelecimento
        const bannerMediaId = establishment_deleted.banner.split('/media/')[1];
        await this.storageService.remove(bannerMediaId);

        // Deleta as imagens na GCP do carousel de imagens gerais do estabelecimento
        establishment_deleted.generalMedias.forEach(async (path) => {
          const mediaId = path.split('/media/')[1];
          await this.storageService.remove(mediaId);
        });

        // Deleta as imagens na GCP do carousel de imagens de menu do estabelecimento
        establishment_deleted.menuOfServicesMedia.forEach(async (path) => {
          const mediaId = path.split('/media/')[1];
          await this.storageService.remove(mediaId);
        });
      } catch (error) {
        console.error('Establishment: Images now found');
      }
    });
  }
}
