import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreateTouristDto } from './dto/create-tourist.dto';
import { UpdateTouristDto } from './dto/update-tourist.dto';
import { UtilsService } from 'src/shared/services/utils.service';

@Injectable()
export class TouristService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  async create(data: CreateTouristDto) {
    const touristExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (touristExists) {
      throw new Error('Tourist already exists');
    }

    return await this.prisma.$transaction(async (tx) => {
      const passwordHash = await this.utils.encryptPassword(data.password);

      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          phone: data.phone,
          passwordHash: passwordHash,
          userRole: 'TOURIST',
        },
      });

      await tx.tourist.create({
        data: {
          userId: user.id,
          id: user.id,
          lastname: data.lastname,
          age: data.age,
          favoriteCategories: {
            connect: data.favoriteCategories.map((categoryId) => ({
              id: categoryId,
            })),
          },
        },
      });

      return { ...user, passwordHash: undefined };
    });
  }

  async findAll() {
    const tourists = await this.prisma.tourist.findMany({
      include: {
        favoriteCategories: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: false,
            email: true,
            name: true,
            phone: true,
            userRole: true,
          },
        },
      },
    });

    return tourists;
  }

  async findOne(id: string) {
    const tourist = await this.prisma.tourist.findUnique({
      where: {
        id,
      },
      include: {
        favoriteCategories: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: false,
            email: true,
            name: true,
            phone: true,
            userRole: true,
          },
        },
      },
    });

    return tourist;
  }

  async update(id: string, data: UpdateTouristDto) {
    const touristExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!touristExists) {
      throw new Error('Tourist does not exists');
    }

    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: {
          id,
        },
        data: {
          email: data.email,
          name: data.name,
          phone: data.phone,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          userRole: true,
          passwordHash: false,
        },
      });

      const tourist = await tx.tourist.update({
        where: {
          id,
        },
        data: {
          lastname: data.lastname,
          age: data.age,
          favoriteCategories: {
            set: data.favoriteCategories?.map((categoryId) => ({
              id: categoryId,
            })),
          },
        },
        include: {
          favoriteCategories: true,
        },
      });

      return Object.assign(user, tourist);
    });
  }

  async remove(id: string) {
    const touristExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!touristExists) {
      throw new Error('Tourist does not exists');
    }

    const tourist_deleted = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return { ...tourist_deleted, passwordHash: undefined };
  }
}
