import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface UserPayload {
  sub: string;
  email: string;
  role: string;
  tenantId: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: UserPayload }>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No se encontró el token de autenticación');
    }
    try {
      const payload = await this.jwtService.verifyAsync<UserPayload>(token, {
        secret: process.env.JWT_SECRET || 'super-secret',
      });
      // 💡 Asignamos el payload al objeto request para que podamos acceder a él en los controladores
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
