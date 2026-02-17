import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto, tenantId: string, userId: string) {
    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        tenantId,
        createdById: userId,
        updatedById: userId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.service.findMany({
      where: { tenantId },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
        updatedBy: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, tenantId },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
        updatedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, tenantId: string, userId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.service.update({
      where: { id },
      data: {
        ...updateServiceDto,
        updatedById: userId,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    return this.prisma.service.delete({
      where: { id },
    });
  }
}
