import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../generated/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Crear el Tenant (Empresa)
        const tenant = await tx.tenant.create({
          data: {
            name: `Negocio de ${name}`,
            description: 'Mi empresa en Turnesa',
          },
        });

        // 2. Crear el Usuario como ADMIN del tenant
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role: Role.ADMIN,
            tenantId: tenant.id,
          },
        });

        return {
          message: 'Usuario registrado exitosamente',
          userId: user.id,
          tenantId: tenant.id,
        };
      });
    } catch (error) {
      console.error('Error in registration:', error);
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }
}
