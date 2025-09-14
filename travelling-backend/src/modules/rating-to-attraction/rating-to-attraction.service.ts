import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateRatingToAttractionDto } from './dto/create-ratingToAttraction.dto';
import { PrismaService } from 'src/database/PrismaService';
import { UpdateRatingToAttractionDto } from './dto/update-ratingToAttraction.dto';
import { UtilsService } from 'src/shared/services/utils.service';
import { RatingToAttractionDto } from './dto/list-ratingToAttraction.dto';

@Injectable()
export class RatingToAttractionService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  async create(
    data: CreateRatingToAttractionDto,
    touristId: string,
    attractionId: string,
    user: User,
  ) {
    const attraction = await this.prisma.attraction.findUnique({
      where: {
        id: attractionId,
      },
    });

    if (!attraction) {
      throw new Error('Attraction does not exists');
    }

    const tourist = await this.prisma.tourist.findUnique({
      where: {
        id: touristId,
      },
    });

    if (!tourist) {
      throw new Error('Tourist does not exists');
    }

    const ratingToAttractionExists =
      await this.prisma.ratingToAttraction.findFirst({
        where: {
          AND: [{ attractionId }, { touristId }],
        },
      });

    if (ratingToAttractionExists) {
      throw new Error('Rating already exists in this attraction by this user');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== touristId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.$transaction(async (tx) => {
      const ratingToAttraction = await tx.ratingToAttraction.create({
        data: {
          ...data,
          tourist: {
            connect: {
              id: touristId,
            },
          },
          attraction: {
            connect: {
              id: attractionId,
            },
          },
        },
      });

      const averageRating = await this.findAverageRatingByAttraction(
        attractionId,
        ratingToAttraction,
      );

      await tx.attraction.update({
        where: {
          id: attractionId,
        },
        data: {
          averageRating,
        },
      });

      return ratingToAttraction;
    });
  }

  async findAll() {
    const ratingToAttraction = await this.prisma.ratingToAttraction.findMany({
      include: {
        attraction: true,
        tourist: true,
      },
    });

    return ratingToAttraction;
  }

  async findOne(id: string) {
    const ratingToAttraction = await this.prisma.ratingToAttraction.findUnique({
      where: {
        id,
      },
      include: {
        attraction: true,
        tourist: true,
      },
    });

    return ratingToAttraction;
  }

  async findRatingByAttraction(attractionId: string) {
    const ratingToAttraction = await this.prisma.ratingToAttraction.findMany({
      where: {
        attractionId,
      },
      include: {
        attraction: true,
        tourist: true,
      },
    });

    return ratingToAttraction;
  }

  async update(
    touristId: string,
    attractionId: string,
    user: User,
    data: UpdateRatingToAttractionDto,
  ) {
    const attraction = await this.prisma.attraction.findUnique({
      where: {
        id: attractionId,
      },
    });

    if (!attraction) {
      throw new Error('Attraction does not exists');
    }

    const tourist = await this.prisma.tourist.findUnique({
      where: {
        id: touristId,
      },
    });

    if (!tourist) {
      throw new Error('Tourist does not exists');
    }

    const ratingToAttractionExists =
      await this.prisma.ratingToAttraction.findFirst({
        where: {
          AND: [{ attractionId }, { touristId }],
        },
      });

    if (!ratingToAttractionExists) {
      throw new Error('Rating does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== touristId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.$transaction(async (tx) => {
      const ratingToAttraction = await tx.ratingToAttraction.update({
        where: {
          id: ratingToAttractionExists.id,
        },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      const averageRating = await this.findAverageRatingByAttraction(
        attractionId,
        ratingToAttraction,
        'editable',
      );

      await tx.attraction.update({
        where: {
          id: attractionId,
        },
        data: {
          averageRating,
        },
      });

      return ratingToAttraction;
    });
  }

  async remove(touristId: string, attractionId: string, user: User) {
    const attraction = await this.prisma.attraction.findUnique({
      where: {
        id: attractionId,
      },
    });

    if (!attraction) {
      throw new Error('Attraction does not exists');
    }

    const tourist = await this.prisma.tourist.findUnique({
      where: {
        id: touristId,
      },
    });

    if (!tourist) {
      throw new Error('Tourist does not exists');
    }

    const ratingToAttractionExists =
      await this.prisma.ratingToAttraction.findFirst({
        where: {
          AND: [{ attractionId }, { touristId }],
        },
      });

    if (!ratingToAttractionExists) {
      throw new Error('RatingToAttraction does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== touristId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.$transaction(async (tx) => {
      const ratingToAttractionDeleted = await tx.ratingToAttraction.delete({
        where: {
          id: ratingToAttractionExists.id,
        },
      });

      const averageRating = await this.findAverageRatingByAttraction(
        attractionId,
        ratingToAttractionDeleted,
        'deletable',
      );

      await tx.attraction.update({
        where: {
          id: attractionId,
        },
        data: {
          averageRating,
        },
      });

      return ratingToAttractionDeleted;
    });
  }

  async findAverageRatingByAttraction(
    attractionId: string,
    newAttractionRating: RatingToAttractionDto,
    mode?: 'editable' | 'deletable',
  ) {
    let ratingToAttraction = await this.prisma.ratingToAttraction.findMany({
      where: {
        attractionId,
      },
    });

    if (mode === 'editable') {
      ratingToAttraction = ratingToAttraction.filter(
        (rating) => rating.touristId !== newAttractionRating.touristId,
      );
    }

    if (mode === 'deletable') {
      return this.utils.calculateAverage(ratingToAttraction);
    }

    return this.utils.calculateAverage([
      ...ratingToAttraction,
      newAttractionRating,
    ]);
  }
}
