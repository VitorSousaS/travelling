import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateRatingToEstablishmentDto } from './dto/create-ratingToEstablishment.dto';
import { PrismaService } from 'src/database/PrismaService';
import { UpdateRatingToEstablishmentDto } from './dto/update-ratingToEstablishment.dto';
import { UtilsService } from 'src/shared/services/utils.service';
import { RatingToEstablishmentDto } from './dto/list-ratingToEstablishment.dto';

@Injectable()
export class RatingToEstablishmentService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  async create(
    data: CreateRatingToEstablishmentDto,
    touristId: string,
    establishmentId: string,
    user: User,
  ) {
    const establishment = await this.prisma.establishment.findUnique({
      where: {
        id: establishmentId,
      },
    });

    if (!establishment) {
      throw new Error('Establishment does not exists');
    }

    const tourist = await this.prisma.tourist.findUnique({
      where: {
        id: touristId,
      },
    });

    if (!tourist) {
      throw new Error('Tourist does not exists');
    }

    const ratingToEstablishmentExists =
      await this.prisma.ratingToEstablishment.findFirst({
        where: {
          AND: [{ establishmentId }, { touristId }],
        },
      });

    if (ratingToEstablishmentExists) {
      throw new Error(
        'Rating already exists in this establishment by this user',
      );
    }

    // If user is root or the establishment don't belong to him
    if (user.id !== touristId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.$transaction(async (tx) => {
      const ratingToEstablishment = await tx.ratingToEstablishment.create({
        data: {
          ...data,
          tourist: {
            connect: {
              id: touristId,
            },
          },
          establishment: {
            connect: {
              id: establishmentId,
            },
          },
        },
      });

      const averageRating = await this.findAverageRatingByEstablishment(
        establishmentId,
        ratingToEstablishment,
      );

      await tx.establishment.update({
        where: { id: establishmentId },
        data: {
          averageRating,
        },
      });

      return ratingToEstablishment;
    });
  }

  async findAll() {
    const ratingToEstablishment =
      await this.prisma.ratingToEstablishment.findMany({
        include: {
          establishment: true,
          tourist: true,
        },
      });

    return ratingToEstablishment;
  }

  async findOne(id: string) {
    const ratingToEstablishment =
      await this.prisma.ratingToEstablishment.findUnique({
        where: {
          id,
        },
        include: {
          establishment: true,
          tourist: true,
        },
      });

    return ratingToEstablishment;
  }

  async findRatingByEstablishment(establishmentId: string) {
    const ratingToEstablishment =
      await this.prisma.ratingToEstablishment.findFirst({
        where: {
          establishmentId,
        },
        include: {
          establishment: true,
          tourist: true,
        },
      });

    return ratingToEstablishment;
  }

  async update(
    touristId: string,
    establishmentId: string,
    user: User,
    data: UpdateRatingToEstablishmentDto,
  ) {
    const establishment = await this.prisma.establishment.findUnique({
      where: {
        id: establishmentId,
      },
    });

    if (!establishment) {
      throw new Error('Establishment does not exists');
    }

    const tourist = await this.prisma.tourist.findUnique({
      where: {
        id: touristId,
      },
    });

    if (!tourist) {
      throw new Error('Tourist does not exists');
    }

    const ratingToEstablishmentExists =
      await this.prisma.ratingToEstablishment.findFirst({
        where: {
          AND: [{ establishmentId }, { touristId }],
        },
      });

    if (!ratingToEstablishmentExists) {
      throw new Error('Rating does not exists');
    }

    // If user is root or the establishment don't belong to him
    if (user.id !== touristId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.$transaction(async (tx) => {
      const ratingToEstablishment = await tx.ratingToEstablishment.update({
        where: {
          id: ratingToEstablishmentExists.id,
        },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      const averageRating = await this.findAverageRatingByEstablishment(
        establishmentId,
        ratingToEstablishment,
        'editable',
      );

      await tx.establishment.update({
        where: { id: establishmentId },
        data: {
          averageRating,
        },
      });

      return ratingToEstablishment;
    });
  }

  async remove(touristId: string, establishmentId: string, user: User) {
    const establishment = await this.prisma.establishment.findUnique({
      where: {
        id: establishmentId,
      },
    });

    if (!establishment) {
      throw new Error('Establishment does not exists');
    }

    const tourist = await this.prisma.tourist.findUnique({
      where: {
        id: touristId,
      },
    });

    if (!tourist) {
      throw new Error('Tourist does not exists');
    }

    const ratingToEstablishmentExists =
      await this.prisma.ratingToEstablishment.findFirst({
        where: {
          AND: [{ establishmentId }, { touristId }],
        },
      });

    if (!ratingToEstablishmentExists) {
      throw new Error('RatingToEstablishment does not exists');
    }

    // If user is root or the establishment don't belong to him
    if (user.id !== touristId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.$transaction(async (tx) => {
      const ratingToEstablishmentDeleted =
        await tx.ratingToEstablishment.delete({
          where: {
            id: ratingToEstablishmentExists.id,
          },
        });

      const averageRating = await this.findAverageRatingByEstablishment(
        establishmentId,
        ratingToEstablishmentDeleted,
        'deletable',
      );

      await tx.establishment.update({
        where: { id: establishmentId },
        data: {
          averageRating,
        },
      });

      return ratingToEstablishmentDeleted;
    });
  }

  async findAverageRatingByEstablishment(
    establishmentId: string,
    newEstablishmentRating: RatingToEstablishmentDto,
    mode?: 'editable' | 'deletable',
  ) {
    let ratingToEstablishment =
      await this.prisma.ratingToEstablishment.findMany({
        where: {
          establishmentId,
        },
      });

    if (mode === 'editable') {
      ratingToEstablishment = ratingToEstablishment.filter(
        (rating) => rating.touristId !== newEstablishmentRating.touristId,
      );
    }

    if (mode === 'deletable') {
      return this.utils.calculateAverage(ratingToEstablishment);
    }

    return this.utils.calculateAverage([
      ...ratingToEstablishment,
      newEstablishmentRating,
    ]);
  }
}
