import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { GraphService } from 'src/app/providers/graph/graph.service';
import { CompareService } from 'src/app/providers/compare/compare.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  row: string;
  number: number;

  private sub: any;
  public dateSingle = new FormControl(new Date());
  public startdate = new FormControl(new Date());
  public enddate = new FormControl(new Date());
  private url: string;

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private graphService: GraphService,
    private compareService: CompareService
  ) {};

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.row = params['row'];
       this.number = params['number'];
    });
    this.url = environment.BACKEND_ADDR + '/apartments/' + this.row  + '/' + this.number + '/consumptions/';
    this.showGraph(this.url+this.getCurrentDate());
  }

  getCurrentDate(): string {
    const dateTime = new Date();
    const today = dateTime.getFullYear() + '/' + (dateTime.getMonth() +1) + '/' + dateTime.getDate();
    dateTime.setDate(dateTime.getDate()-1);
    return dateTime.getFullYear() + '/' + (dateTime.getMonth() +1) + '/' + dateTime.getDate() + '/' + today;
  }

  selectDate(): void {
    const urlArray = this.compareService.selectDate(this.dateSingle, this.url);
    this.showGraph(urlArray[0]);
  }

  selectRangeDate(): void {
    const urlArray = this.compareService.selectRangeDate(this.startdate, this.enddate, this.url);
    this.showGraph(urlArray[0]);
  }

  showGraph(url: string): void {
    this.zone.runOutsideAngular(() => {
      this.graphService.getChart(url);
    });
  }
}
