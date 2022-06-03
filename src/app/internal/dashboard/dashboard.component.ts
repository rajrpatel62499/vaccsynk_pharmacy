import { VaccynkService } from 'src/app/services/vaccynk.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { MultiDataSet, Label, Color, BaseChartDirective } from 'ng2-charts';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  type: any = 'WEEK';

  isLoading = false;
  dashboardData: any;
  // dougnutchart  
  doughnutChartLabels: Label[] = ['Cancelled Appointment', 'New Appointment'];
  public doughnutOptions = {
    legend: {
      display: true,
      position: 'right',
      labels: {
        fontSize: 12,
        usePointStyle: true
      }
    },
    tooltips: {
      enabled: false
    },

    cutoutPercentage: 30,
  }
  doughnutChartData: any = [
    [40, 60],

  ];
  public doughnutChart = [
    {
      backgroundColor: [
        '#B2DF8A',
        '#E31A1C',
      ]
    }
  ];


  doughnutChartType: ChartType = 'doughnut';






  // line chart 

  public lineChartData: ChartDataSets[] = [
    { data: [10,20,30,40,50,60,80,90], label: 'New Request' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: '1st Dose' },
    { data: [180, 480, 770, 90, 1000, 270, 400], label: '2nd Dose', yAxisID: 'y-axis-1', borderWidth: 2 }
  ];
  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,

    legend: {
      display: true,
      position: 'right',
      labels: {
        fontSize: 12,
        usePointStyle: true
      }
    },

    // maintainAspectRatio: false,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1', 
          position: 'right',
          gridLines: {
            color: '#F0F0F0',
            display: false
          },
          ticks: {
            fontColor: 'red',
            display: false
          }
        }
      ]
    },
    
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 0.5,
          fill: false,

          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno',
            fontSize: 12,

          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'transparent',
      borderColor: '#B2DF8A',
      pointBackgroundColor: '#B2DF8A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'transparent',
      borderColor: '#1F78B4',
      pointBackgroundColor: '#A6CEE3',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'transparent',
      borderColor: '#A6CEE3',
      pointBackgroundColor: '#1F78B4',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  // public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;



  // bar chart


  public barChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartColors = [
    { backgroundColor: "#1F78B4" },
    { backgroundColor: "#1F78B4" },
    { backgroundColor: "#1F78B4" },
    { backgroundColor: "#1F78B4" }
  ];

  public barChartData: ChartDataSets[] = [


    {
      barThickness: 16,
      barPercentage: 0.5,
      categoryPercentage: 0.8,
      data: [65, 59, 80, 81, 56, 55, 40],
      label: 'Vaccine',


    },
    // roundedBar: {
    //   barPercentage: 0.9
    // }

  ];


  public barChartOptions: any = {
    barRoundness: 0.3,   

    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      
      yAxes: [{
        gridLines: {
          display: false
        }
      }]
    },
    responsive: true,
    cornerRadius: 100,


  };

  lineChartDataOne: ChartDataSets[] = [

    { data: [85, 72, 78, 75, 77, 75], borderWidth: 2, lineTension: 0, label: 'Vaccine Doses', fill: false },

  ];

  lineChartLabelsOne: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];

  lineChartOptionsOne = {
    responsive: true,
    lineTension: 0,
    fill: true,
    scales: {
      xAxes: [{
        scaleFontSize: 10,
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        }
      }]
    },

  };

  lineChartColorsOne: Color[] = [
    {
      borderColor: ' #B2DF8A',
    },
  ];

  lineChartLegendOne = false;
  lineChartPlugins = [];
  lineChartTypeOne = 'line';


  constructor(private _auth: AuthService, public util: UtilsService, private toastr: ToastrService, public vacService: VaccynkService) {

    //   this.vacService.getDashboardData(this.type).pipe(map((resp:any) =>
    //   resp.dashboardData.slice(0,5) )).subscribe(resp => {
    //     resp.forEach(item => {
    //       // this.doughnutChartLabels.push(item.name);
    //       this.doughnutChartData.push(item.appoitmentGraph[0].appoitmentGraph.newRequest)
    //   })
    // })

  }

  ngOnInit(): void {
    this.getDashboardData(this.type);

    this.vacService.getDashboardData(this.type).subscribe(
      data => {
        this.setAppointmentGraphData(data);
        console.log('fm;fwflm', data.appoitmentGraph);
        
        // FILL THE CHART ARRAY WITH DATA.
      },
      (err: HttpErrorResponse) => {
        

        console.log(err.message);
      }
    );

    // this.vacService.getDashboardData(this.type).subscribe((data:any) => {
    //   this.lineChartLabels = Object.keys(data.doseGraph[0]);
    //   this.lineChartLabels.forEach(label => {
    //     this.lineChartData[0].data.push(data[label]['day']);
    //     this.lineChartData[1].data.push(data[label]['year']);
    //   });
    // });;

  }





  setAppointmentGraphData(data) {
    this.doughnutChartData = [
      [
        data.appoitmentGraph.newRequest,
        data.appoitmentGraph.cancelledRequest
      ]
    ];
  }
  onChartClick(event) {
    console.log(event);
  }
  getDashboardData(type: string) {
    
    this.isLoading = true;
    this.vacService.getDashboardData(type).subscribe(res => {
      this.dashboardData = res;
      console.log(`${type}`, res);
      this.isLoading = false;

    },
      err => {
        console.log(err);
      this.isLoading = false;
        this.util.handleError(err.error.message);
      })
  } 

  onFilter(type) {
    this.type = type;
    this.getDashboardData(type);
  }


}
