import { Request } from 'express'
import { JsonController, Post, OnUndefined, Body, Req, Delete, Param, Get, BadRequestError, NotFoundError } from 'routing-controllers';
import { ApartmentDTO } from '../dto/apartments.dto';
import { LogsUtil } from '../utils/logs.util';
import { Apartment } from '../entities/apartment.entity';
import { ApartmentService } from '../services/apartment.service';
import { Consumption } from '../entities/consumption.entity';


@JsonController('/apartments')
export class ApartmentController {
    constructor(private readonly apartmentService: ApartmentService) {}
    @Post()
    @OnUndefined(201)
    async create(@Body() apartmentDto: ApartmentDTO, @Req() req: Request): Promise<void> {
        LogsUtil.logRequest(req);
        await this.apartmentService.create(apartmentDto)
        .catch(() => {
            throw new BadRequestError("Error during apartment creation.");
        })
    }

    @Delete('/:uuid')
    @OnUndefined(201)
    async delete(@Param('uuid') uuid: string, @Req() req: Request) {
        LogsUtil.logRequest(req);
        await this.apartmentService.delete(uuid)
        .catch(() => {
            throw new BadRequestError();
        })
    }

    @Get('/:uuid')
    @OnUndefined(404)
    async getOneByUuid(@Param('uuid') uuid: string, @Req() req: Request): Promise<Apartment> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getOneByUuid(uuid)
        .catch(() => {
            throw new NotFoundError();
        })
    }

    @Get('/:uuid/consumptions')
    @OnUndefined(404)
    async getConsumptionsByApartments(@Param('uuid') uuid: string, @Req() req: Request): Promise<Consumption[]> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getConsumptionsOfApartment(uuid)
        .catch(() => {
            throw new NotFoundError();
        })
    }

    @Get()
    @OnUndefined(404)
    async getAll(@Req() req: Request): Promise<Apartment[]> {
        LogsUtil.logRequest(req);
        return await this.apartmentService.getAll()
        .catch(() => {
            throw new NotFoundError();
        })
    }
}