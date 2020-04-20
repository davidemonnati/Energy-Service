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
  public date = new FormControl(new Date());
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

  selectData(): void {
    const day = ('0' + (this.date.value.getDate())).slice(-2);
    const month = ('0' + (this.date.value.getUTCMonth() + 1)).slice(-2);
    const year = this.date.value.getFullYear();

    const url = this.url + year + '/' + month + '/' + day ;
    this.showGraph(url);
  }

  showGraph(url: string): void {
    this.zone.runOutsideAngular(() => {
      this.graphService.getChart(url);
    });
  }
}
