import { Injectable } from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { PrismaService } from 'src/database/PrismaService';
import { UtilsService } from 'src/shared/services/utils.service';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Injectable()
export class AgencyService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  async create(data: CreateAgencyDto) {
    const agencyExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (agencyExists) {
      throw new Error('Agency already exists');
    }

    return await this.prisma.$transaction(async (tx) => {
      const passwordHash = await this.utils.encryptPassword(data.password);

      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          phone: data.phone,
          passwordHash: passwordHash,
          userRole: 'AGENCY',
        },
      });

      await tx.agency.create({
        data: {
          id: user.id,
          userId: user.id,
        },
      });

      return { ...user, passwordHash: undefined };
    });
  }

  async findAll() {
    const agencies = await this.prisma.agency.findMany({
      select: {
        id: true,
        userId: false,
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

    return agencies;
  }

  async findOne(id: string) {
    const agency = await this.prisma.agency.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userId: false,
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

    return agency;
  }

  async update(id: string, data: UpdateAgencyDto) {
    const agencyExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!agencyExists) {
      throw new Error('Agency does not exists');
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async remove(id: string) {
    const agencyExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!agencyExists) {
      throw new Error('Agency does not exists');
    }

    const agency_deleted = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return { ...agency_deleted, passwordHash: undefined };
  }
}
