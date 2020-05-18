import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { GraphService } from 'src/app/providers/graph/graph.service';

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
  public dateInterval1 = new FormControl(new Date());
  public dateInterval2 = new FormControl(new Date());
  private url: string;

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private graphService: GraphService
  ) {};

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.row = params['row'];
       this.number = params['number'];
    });
    this.url = environment.BACKEND_ADDR + '/apartments/' + this.row  + '/' + this.number + '/consumptions/';
    this.showGraph(this.url);
  }

  selectDate(): void {
    const day = ('0' + (this.dateSingle.value.getDate())).slice(-2);
    const month = ('0' + (this.dateSingle.value.getMonth()+1)).slice(-2);
    const year = this.dateSingle.value.getFullYear();

    const url = this.url + year + '/' + month + '/' + day ;
    this.showGraph(url);
  }

  selectRangeDate(): void {
    const day1 = ('0' + (this.dateInterval1.value.getDate())).slice(-2);
    const month1 = ('0' + (this.dateInterval1.value.getMonth()+1)).slice(-2);
    const year1 = this.dateInterval1.value.getFullYear();

    const day2 = ('0' + (this.dateInterval2.value.getDate())).slice(-2);
    const month2 = ('0' + (this.dateInterval2.value.getMonth()+1)).slice(-2);
    const year2 = this.dateInterval2.value.getFullYear();

    const url = this.url + year1 + '/' + month1 + '/' + day1 + '/'+ year2 + '/' + month2 + '/' + day2;
    this.showGraph(url);
  }

  showGraph(url: string): void {
    this.zone.runOutsideAngular(() => {
      this.graphService.getChart(url);
    });
  }
}
