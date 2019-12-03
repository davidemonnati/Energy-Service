"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var consumption_entity_1 = require("./consumption.entity");
var Apartment = /** @class */ (function () {
    function Apartment(uuid, number, description, row, consuptions) {
        this.uuid = uuid;
        this.number = number;
        this.row = row;
        this.description = description;
        this.consumptions = consuptions;
    }
    __decorate([
        typeorm_1.PrimaryColumn('uuid')
    ], Apartment.prototype, "uuid", void 0);
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 150 })
    ], Apartment.prototype, "number", void 0);
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 150 })
    ], Apartment.prototype, "row", void 0);
    __decorate([
        typeorm_1.Column({ type: 'text', nullable: true })
    ], Apartment.prototype, "description", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return consumption_entity_1.Consumption; }, function (consumptions) { return consumptions.apartment; })
    ], Apartment.prototype, "consumptions", void 0);
    Apartment = __decorate([
        typeorm_1.Entity("Apartment")
    ], Apartment);
    return Apartment;
}());
exports.Apartment = Apartment;
