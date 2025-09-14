import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { PrismaService } from 'src/database/PrismaService';
import { UtilsService } from 'src/shared/services/utils.service';

@Injectable()
export class BusinessService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  async create(data: CreateBusinessDto) {
    const businessExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (businessExists) {
      throw new Error('Business already exists');
    }

    return await this.prisma.$transaction(async (tx) => {
      const passwordHash = await this.utils.encryptPassword(data.password);

      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          phone: data.phone,
          passwordHash: passwordHash,
          userRole: 'BUSINESS',
        },
      });

      await tx.business.create({
        data: {
          id: user.id,
          userId: user.id,
        },
      });

      return { ...user, passwordHash: undefined };
    });
  }

  async findAll() {
    const businesses = await this.prisma.business.findMany({
      include: {
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

    return businesses;
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: {
        id,
      },
      include: {
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

    return business;
  }

  async update(id: string, data: UpdateBusinessDto) {
    const businessExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!businessExists) {
      throw new Error('Business does not exists');
    }

    const business = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        updatedAt: new Date(),
      },
    });

    return business;
  }

  async remove(id: string) {
    const businessExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!businessExists) {
      throw new Error('Business does not exists');
    }

    const business_deleted = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return { ...business_deleted, passwordHash: undefined };
  }
}
