import { Request } from 'express'
import { JsonController, Post, OnUndefined, Body, Req, Param, Delete, Get, BadRequestError, NotFoundError } from 'routing-controllers';
import { ConsumptionService } from '../services/consumption.service'
import { LogsUtil } from '../utils/logs.util';
import { ConsumptionDTO } from '../dto/consumption.dto';
import { Consumption } from '../entities/consumption.entity';


@JsonController('/consumptions')
export class ConsumptionController {
    constructor(private readonly consumptionService: ConsumptionService) {}

    @Post()
    @OnUndefined(201)
    async create(@Body() consumptionDTO: ConsumptionDTO, @Req() req: Request): Promise<void> {
        LogsUtil.logRequest(req);
        await this.consumptionService.create(consumptionDTO)
        .catch(() => {
            throw new BadRequestError();
        })
    }

    @Delete('/:id')
    @OnUndefined(201)
    async delete(@Param('id') id: number, @Req() req: Request) {
        LogsUtil.logRequest(req);
        await this.consumptionService.delete(id)
        .catch(() => {
            throw new BadRequestError();
        })
    }

    @Get('/:id')
    @OnUndefined(404)
    async getOneByid(@Param('id') id: number, @Req() req: Request): Promise<Consumption> {
        LogsUtil.logRequest(req);
        return await this.consumptionService.getOneByid(id)
        .catch(() => {
            throw new NotFoundError();
        })
    }

    @Get()
    @OnUndefined(404)
    async getAll(@Req() req: Request): Promise<Consumption[]> {
        LogsUtil.logRequest(req);
        return await this.consumptionService.getAll()
        .catch(() => {
            throw new NotFoundError();
        })
    }
}