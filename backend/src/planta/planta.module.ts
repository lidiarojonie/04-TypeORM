import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vivero } from "../vivero/entities/vivero.entity";
import { Planta } from "./entities/planta.entity";
import { PlantaController } from "./planta.controller";
import { PlantaService } from "./planta.service";

@Module({
  imports: [TypeOrmModule.forFeature([Vivero, Planta])],
  controllers: [PlantaController],
  providers: [PlantaService],
})
export class PlantaModule {}