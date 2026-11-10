import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vivero } from "../vivero/entities/vivero.entity";
import { Planta } from "./entities/planta.entity";

@Injectable()
export class PlantaService {
  constructor(
    @InjectRepository(Planta)
    private readonly plantaRepository: Repository<Planta>,
    @InjectRepository(Vivero)
    private readonly viveroRepository: Repository<Vivero>,
  ) {}

  findAll() {
    return this.plantaRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.vivero", "principal")
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  findByVivero(principalId: number) {
    return this.plantaRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.vivero", "principal")
      .where("principal.id = :principalId", { principalId })
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  searchByName(text: string) {
    return this.plantaRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.vivero", "principal")
      .where("registro.nombre ILIKE :pattern", { pattern: `%${text}%` })
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  findByViveroAndMinimum(principalId: number, minimum: number) {
    return this.plantaRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.vivero", "principal")
      .where("principal.id = :principalId", { principalId })
      .andWhere("registro.alturaCm >= :minimum", { minimum })
      .orderBy("registro.alturaCm", "DESC")
      .getMany();
  }

  countByVivero() {
    return this.viveroRepository
      .createQueryBuilder("principal")
      .leftJoin("principal.plantas", "registro")
      .select("principal.id", "id")
      .addSelect("principal.nombre", "nombre")
      .addSelect("COUNT(registro.id)", "total")
      .groupBy("principal.id")
      .addGroupBy("principal.nombre")
      .orderBy("principal.id", "ASC")
      .getRawMany();
  }

  create(planta: Planta) {
    return this.plantaRepository.save(planta);
  }

  async updateField(
    id: number,
    fieldName: "nombre" | "alturaCm",
    newValue: string | number,
  ): Promise<Planta | null> {
    const planta = await this.plantaRepository.findOne({ where: { id } });
    if (!planta) {
      return null;
    }

    if (fieldName === "nombre" && typeof newValue === "string") {
      planta.nombre = newValue;
    } else if (fieldName === "alturaCm" && typeof newValue === "number") {
      planta.alturaCm = newValue;
    } else {
      throw new TypeError(`Invalid value for Planta field "${fieldName}"`);
    }

    return this.plantaRepository.save(planta);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.plantaRepository.delete(id);
    return result.affected !== undefined && result.affected > 0;
  }

  async changeVivero(plantaId: number, newViveroId: number): Promise<Planta | null> {
    const planta = await this.plantaRepository.findOne({ where: { id: plantaId } });
    if (!planta) {
      return null;
    }

    const newVivero = await this.viveroRepository.findOne({ where: { id: newViveroId } });
    if (!newVivero) {
      return null;
    }

    planta.vivero = newVivero;
    return this.plantaRepository.save(planta);
  }

  findByViveroAndTaller(principalId: number, minimum: number) {
    return this.plantaRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.vivero", "principal")
      .where("principal.id = :principalId", { principalId })
      .andWhere("registro.alturaCm > :minimum", { minimum })
      .orderBy("registro.alturaCm", "DESC")
      .getMany();
  }


}