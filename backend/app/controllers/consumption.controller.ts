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

    @Delete('/consumptions/:uuid')
    @OnUndefined(201)
    async delete(@Param('uuid') uuid: string, @Req() req: Request) {
        LogsUtil.logRequest(req);
        await this.consumptionService.delete(uuid)
        .catch(() => {
            throw new BadRequestError();
        })
    }

    @Get('/consumptions/:uuid')
    @OnUndefined(404)
    async getOneByUuid(@Param('uuid') uuid: string, @Req() req: Request): Promise<Consumption> {
        LogsUtil.logRequest(req);
        return await this.consumptionService.getOneByUuid(uuid)
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