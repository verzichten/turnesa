import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(
    @Body() createServiceDto: CreateServiceDto,
    @GetUser('tenantId') tenantId: string,
  ) {
    return this.servicesService.create(createServiceDto, tenantId);
  }

  @Get()
  findAll(@GetUser('tenantId') tenantId: string) {
    return this.servicesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.servicesService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @GetUser('tenantId') tenantId: string,
  ) {
    return this.servicesService.update(id, updateServiceDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('tenantId') tenantId: string) {
    return this.servicesService.remove(id, tenantId);
  }
}
