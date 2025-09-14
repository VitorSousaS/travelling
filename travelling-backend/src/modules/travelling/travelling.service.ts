import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTravellingDto } from './dto/create-travelling.dto';
import { UpdateTravellingDto } from './dto/update-travelling.dto';
import { PrismaService } from 'src/database/PrismaService';
import { User } from '@prisma/client';
import { LocalService } from '../local/local.service';

@Injectable()
export class TravellingService {
  constructor(
    private prisma: PrismaService,
    private localService: LocalService,
  ) {}

  async create(data: CreateTravellingDto, user: User, touristId: string) {
    const travellingExists = await this.prisma.travelling.findFirst({
      where: {
        title: data.title,
      },
    });

    if (travellingExists) {
      throw new Error('Travelling already exists with this title!');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== touristId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const tourist = await this.prisma.tourist.findUnique({
      where: {
        id: touristId,
      },
    });

    if (!tourist) {
      throw new Error('Tourist does not exists');
    }

    return await this.prisma.$transaction(async (tx) => {
      const localPromises = data.locals.map((local, index) => {
        if (local.position !== index) {
          throw new Error('Index local invalid!');
        }
        return this.localService.create(local);
      });

      let locals = await Promise.all(localPromises);

      locals = locals.length > 0 ? locals : [];

      const travelling = await tx.travelling.create({
        data: {
          ...data,
          locals: {
            connect: locals.map((local) => ({ id: local.id })),
          },
          tourist: {
            connect: {
              id: tourist.id,
            },
          },
        },
        include: {
          locals: {
            select: {
              id: true,
              position: true,
              type: true,
              attraction: {
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
              },
              establishment: {
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
              },
            },
          },
        },
      });

      return travelling;
    });
  }

  async findAll() {
    const travellings = await this.prisma.travelling.findMany({
      include: {
        locals: {
          select: {
            id: true,
            position: true,
            type: true,
            attraction: {
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
            },
            establishment: {
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
            },
          },
        },
      },
    });

    return travellings;
  }

  async findOne(id: string) {
    const travelling = await this.prisma.travelling.findUnique({
      where: {
        id,
      },
      include: {
        locals: {
          select: {
            id: true,
            position: true,
            type: true,
            attraction: {
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
            },
            establishment: {
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
            },
          },
        },
      },
    });

    return travelling;
  }

  async findByTourist(touristId: string) {
    const travelling = await this.prisma.travelling.findMany({
      where: {
        touristId,
      },
      include: {
        locals: {
          select: {
            id: true,
            position: true,
            type: true,
            attraction: {
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
            },
            establishment: {
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
            },
          },
        },
      },
    });

    return travelling;
  }

  async update(id: string, user: User, data: UpdateTravellingDto) {
    const travellingExists = await this.prisma.travelling.findFirst({
      where: {
        id,
      },
      include: {
        locals: true,
      },
    });

    if (!travellingExists) {
      throw new Error('Travelling does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== travellingExists.touristId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const updatedLocals = await this.prisma.$transaction(async () => {
      if (data.locals && data.locals.length > 0) {
        const localsRemoved = travellingExists.locals.map((local) =>
          this.localService.remove(local.id),
        );

        await Promise.all(localsRemoved);

        const localCreated = data.locals.map((local, index) => {
          if (local.position !== index) {
            throw new Error('Index local invalid!');
          }
          return this.localService.create(local, travellingExists.id);
        });

        const locals = await Promise.all(localCreated);

        return locals;
      }
      return [];
    });

    const travelling = await this.prisma.travelling.update({
      where: {
        id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
        locals: {
          connect: updatedLocals.map((local) => ({ id: local.id })),
        },
      },
      include: {
        locals: {
          select: {
            id: true,
            position: true,
            type: true,
            attraction: {
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
            },
            establishment: {
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
            },
          },
        },
      },
    });

    return travelling;
  }

  async remove(id: string, user: User) {
    const travellingExists = await this.prisma.travelling.findUnique({
      where: {
        id,
      },
    });

    if (!travellingExists) {
      throw new Error('Travelling does not exists');
    }

    // If user is root or the attraction don't belong to him
    if (user.id !== travellingExists.touristId && user.userRole !== 'ADMIN') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.travelling.delete({
      where: {
        id,
      },
    });
  }
}
