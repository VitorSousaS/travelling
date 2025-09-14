import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { UtilsService } from 'src/shared/services/utils.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  async create(data: CreateUserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const passwordHash = await this.utils.encryptPassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        passwordHash: passwordHash,
        userRole: 'ADMIN',
      },
    });

    return { ...user, passwordHash: undefined };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        passwordHash: false,
        agency: true,
        business: true,
        tourist: true,
        userRole: true,
      },
    });

    return users;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        passwordHash: true,
        agency: true,
        business: true,
        tourist: {
          include: {
            favoriteCategories: true,
          },
        },
        userRole: true,
      },
    });

    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        passwordHash: false,
        agency: true,
        business: true,
        tourist: {
          include: {
            favoriteCategories: true,
          },
        },
        userRole: true,
      },
    });

    return user;
  }
}
