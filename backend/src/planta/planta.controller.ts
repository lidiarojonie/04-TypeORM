import { 
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PlantaService } from "./planta.service";
import { Planta } from "./entities/planta.entity";

@Controller("plantas")
export class PlantaController {
  constructor(private readonly plantaService: PlantaService) {}

  @Get()
  findAll() {
    return this.plantaService.findAll();
  }

  @Get("vivero/:principalId")
  findByVivero(@Param("principalId") principalId: string) {
    return this.plantaService.findByVivero(Number(principalId));
  }

  @Get("buscar")
  searchByName(@Query("texto") text: string) {
    return this.plantaService.searchByName(text);
  }

  @Get("vivero/:principalId/minimo/:minimum")
  findByViveroAndMinimum(
    @Param("principalId") principalId: string,
    @Param("minimum") minimum: string,
  ) {
    return this.plantaService.findByViveroAndMinimum(Number(principalId), Number(minimum));
  }

  @Get("resumen/vivero")
  countByVivero() {
    return this.plantaService.countByVivero();
  }

  @Post("crear")
  create(@Body() planta: Planta) {
    return this.plantaService.create(planta);
  }

  @Patch(":id/campo")
  updateField(
    @Param("id") id: string,
    @Body("nombreCampo") fieldName: "nombre" | "alturaCm",
    @Body("nuevoValor") newValue: string | number,
  ) {
    return this.plantaService.updateField(Number(id), fieldName, newValue);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.plantaService.delete(Number(id));
  }

  @Patch(":plantaId/cambiar-vivero/:nuevoViveroId")
  async changeVivero(
    @Param("plantaId") plantaId: string,
    @Param("nuevoViveroId") newViveroId: string,
  ) {
    const plantaIdNumber = Number(plantaId);
    const newViveroIdNumber = Number(newViveroId);
    if (
      !Number.isInteger(plantaIdNumber) ||
      plantaIdNumber <= 0 ||
      !Number.isInteger(newViveroIdNumber) ||
      newViveroIdNumber <= 0
    ) {
      throw new BadRequestException("Los IDs deben ser enteros positivos");
    }

    const planta = await this.plantaService.changeVivero(plantaIdNumber, newViveroIdNumber);
    if (!planta) {
      throw new NotFoundException("No se encontró la planta o el vivero indicado");
    }
    return planta;
  }

  @Get("vivero/:principalId/taller/:minimum")
  findByViveroAndTaller(
    @Param("principalId") principalId: string,
    @Param("minimum") minimum: string,
  ) {
    const principalIdNumber = Number(principalId);
    const minimumNumber = Number(minimum);
    if (!Number.isInteger(principalIdNumber) || principalIdNumber <= 0) {
      throw new BadRequestException("El ID del vivero debe ser un entero positivo");
    }
    if (!Number.isFinite(minimumNumber) || minimumNumber < 0) {
      throw new BadRequestException("La altura mínima debe ser un número no negativo");
    }

    return this.plantaService.findByViveroAndTaller(principalIdNumber, minimumNumber);
  }
} 
