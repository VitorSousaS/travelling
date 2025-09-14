import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaService } from 'src/database/PrismaService';
import { User } from '@prisma/client';

@Injectable()
export class ContractService {
  constructor(private prisma: PrismaService) {}

  async create(attractionId: string, agencyId: string, touristId: string) {
    const attractionExists = await this.prisma.attraction.findUnique({
      where: {
        id: attractionId,
      },
    });

    if (!attractionExists) {
      throw new Error('Attraction does not exists');
    }

    const agencyExists = await this.prisma.agency.findUnique({
      where: {
        id: agencyId,
      },
    });

    if (!agencyExists) {
      throw new Error('Agency does not exists');
    }

    const touristExists = await this.prisma.tourist.findUnique({
      where: {
        id: touristId,
      },
    });

    if (!touristExists) {
      throw new Error('Tourist does not exists');
    }

    const contractExists = await this.prisma.contract.findFirst({
      where: {
        AND: [{ attractionId }, { touristId }, { agencyId }],
      },
    });

    if (contractExists) {
      throw new Error('Contract already exists!');
    }

    return await this.prisma.contract.create({
      data: {
        attraction: {
          connect: {
            id: attractionId,
          },
        },
        agency: {
          connect: {
            id: agencyId,
          },
        },
        tourist: {
          connect: {
            id: touristId,
          },
        },
      },
    });
  }

  async findAll() {
    const contracts = await this.prisma.contract.findMany({
      include: {
        agency: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                userRole: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        attraction: {
          select: {
            id: true,
            banner: true,
            name: true,
            location: true,
            date: true,
          },
        },
        tourist: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
            lastname: true,
          },
        },
      },
    });

    return contracts;
  }

  async findByAgency(agencyId: string) {
    const contracts = await this.prisma.contract.findMany({
      where: {
        agencyId: agencyId,
      },
      include: {
        agency: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                userRole: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        attraction: {
          select: {
            id: true,
            banner: true,
            name: true,
            location: true,
            date: true,
          },
        },
        tourist: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
            lastname: true,
          },
        },
      },
    });

    return contracts;
  }

  async findByTourist(touristId: string) {
    let contracts = await this.prisma.contract.findMany({
      where: {
        touristId: touristId,
      },
      include: {
        agency: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                userRole: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        attraction: {
          select: {
            id: true,
            banner: true,
            name: true,
            location: true,
            date: true,
            ratings: {},
          },
        },
        tourist: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
            lastname: true,
          },
        },
      },
    });

    // Agora, vamos percorrer os contratos e adicionar os ratings específicos do turista
    for (const contract of contracts) {
      const rating = await this.prisma.ratingToAttraction.findFirst({
        where: {
          AND: [
            { touristId: touristId },
            { attractionId: contract.attractionId },
          ],
        },
      });

      // Se um rating for encontrado, o adicionamos ao contrato
      if (rating) {
        contract.attraction.ratings = [rating];
      } else {
        contract.attraction.ratings = [];
      }
    }

    return contracts;
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: {
        id,
      },
      include: {
        agency: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                userRole: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        attraction: {
          select: {
            id: true,
            banner: true,
            name: true,
            location: true,
            date: true,
          },
        },
        tourist: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
            lastname: true,
          },
        },
      },
    });

    return contract;
  }

  async update(id: string, user: User, data: UpdateContractDto) {
    const contractExists = await this.prisma.contract.findUnique({
      where: {
        id,
      },
    });

    if (!contractExists) {
      throw new Error('Contract does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== contractExists.agencyId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const contract_updated = await this.prisma.contract.update({
      where: {
        id,
      },
      data: {
        status: data.status,
      },
    });

    return contract_updated;
  }

  async remove(id: string, user: User) {
    const contractExists = await this.prisma.contract.findUnique({
      where: {
        id,
      },
    });

    if (!contractExists) {
      throw new Error('Contract does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== contractExists.agencyId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const contract_deleted = await this.prisma.contract.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });

    return contract_deleted;
  }

  async removeFromDatabase(id: string, user: User) {
    const contractExists = await this.prisma.contract.findUnique({
      where: {
        id,
      },
    });

    if (!contractExists) {
      throw new Error('Contract does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== contractExists.agencyId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const contract_deleted = await this.prisma.contract.delete({
      where: {
        id,
      },
    });

    return contract_deleted;
  }
}
