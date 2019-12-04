"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
        typeorm_1.PrimaryColumn('uuid'),
        __metadata("design:type", String)
    ], Apartment.prototype, "uuid", void 0);
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 150 }),
        __metadata("design:type", String)
    ], Apartment.prototype, "number", void 0);
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 150 }),
        __metadata("design:type", String)
    ], Apartment.prototype, "row", void 0);
    __decorate([
        typeorm_1.Column({ type: 'text', nullable: true }),
        __metadata("design:type", String)
    ], Apartment.prototype, "description", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return consumption_entity_1.Consumption; }, function (consumption) { return consumption.apartment; }),
        __metadata("design:type", Array)
    ], Apartment.prototype, "consumptions", void 0);
    Apartment = __decorate([
        typeorm_1.Entity("Apartment"),
        __metadata("design:paramtypes", [String, String, String, String, Array])
    ], Apartment);
    return Apartment;
}());
exports.Apartment = Apartment;
