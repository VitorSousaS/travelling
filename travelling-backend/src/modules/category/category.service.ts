import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    const categoryExists = await this.prisma.category.findFirst({
      where: {
        title: data.title,
      },
    });

    if (categoryExists) {
      throw new Error('Category already exists');
    }

    const category = await this.prisma.category.create({
      data,
    });

    return category;
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();

    return categories;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    return category;
  }

  async update(id: string, data: UpdateCategoryDto) {
    const categoryExists = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!categoryExists) {
      throw new Error('Category does not exists');
    }

    return await this.prisma.category.update({
      data: { ...data, updatedAt: new Date() },
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!categoryExists) {
      throw new Error('Category does not exists');
    }

    return await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
