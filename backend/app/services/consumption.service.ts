import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ConsumptionRepository } from '../repositories/consumption.repository';
import { ConsumptionDTO } from '../dto/consumption.dto';
import { Consumption } from '../entities/consumption.entity';

Service()
export class ConsumptionService {
    constructor(
        @InjectRepository()
        private readonly consumptionRepository: ConsumptionRepository,
    ) {}

    async create(consumptionDto: ConsumptionDTO): Promise<void> {
        await this.consumptionRepository.create(consumptionDto);
    }

    async delete(id: number) {
        await this.consumptionRepository.getOneByid(id)
        .then((consumption) => this.consumptionRepository.delete(consumption));
    }

    async getOneByid(id: number): Promise<Consumption> {
        return await this.consumptionRepository.getOneByid(id);
    }

    async getAll(): Promise<Consumption[]> {
        return await this.consumptionRepository.getAll();
    }
}