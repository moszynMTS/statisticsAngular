import { Component, OnInit, QueryList, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiCaller } from 'src/app/shared/apiCaller';
import { ControllerNames } from 'src/app/shared/controlerNames';
import { TranslateService } from '@ngx-translate/core';
import { SelectableComponent } from '../selectable/selectable.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChildren('canvas') canvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  dataSetLink: string = environment.dataSet;
  dataSetName: string = environment.dataSetName;
  chartColors: string[] = [
    '#E6F4EA',
    '#C8E6C9',
    '#A8D5BA',
    '#81C784',
    '#6CCF70',
    '#4CAF50',
    '#3B873E',
    '#2D6E31',
    '#1F4F23',
    '#133719',
  ];
  charts: any[] = [];
  chartTypes: any[] = [
    { type: 'bar'},
    { type: 'line'},
    { type: 'pie'},
    { type: 'doughnut'},
  ];
  counter: number = 1;
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private apiCaller: ApiCaller, private translate: TranslateService, private dialog: MatDialog,) {
    Chart.register(...registerables);
    this.apiCaller.setControllerPath(ControllerNames.Data);
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

  initializeForms(): void {
    this.createCanvasForm(`${this.counter}`, 'bar', `#${this.counter} Bar`, 'Bar', [12, 19, 3, 5, 2], ['Red', 'Blue', 'Yellow', 'Green', 'Orange']);
    this.createCanvasForm(`${this.counter}`, 'line', `#${this.counter} Line`, 'Line', [10, 15, 5, 7, 10], ['January', 'February', 'March', 'April', 'May']);
    this.createCanvasForm(`${this.counter}`, 'pie', `#${this.counter} Pie`, 'Pie', [12, 19, 3, 5, 2], ['Red', 'Blue', 'Yellow', 'Green', 'Orange']);
    this.createCanvasForm(`${this.counter}`, 'doughnut', `#${this.counter} Doughnut`, 'Doughnut', [12, 19, 3, 5, 2], ['Red', 'Blue', 'Yellow', 'Green', 'Orange']);
  }
  

  switchState(form: FormGroup): void {
    const currentState = form.value.showedConfig;
    form.patchValue({
      showedConfig: !currentState,
    });
  }

  createCharts(): void {
    this.charts.forEach((chart, index) => {
      if (chart.instance) {
        chart.instance.destroy();
        chart.instance = null;
      }
    });
  
    this.canvases.toArray().forEach((canvasElement, index) => {
      const chart = this.charts[index];
      const { data, labels, title, type } = chart.form.value;

      const chartInstance = new Chart(canvasElement.nativeElement, {
        type: type,
        data: {
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: this.chartColors,
              borderColor: this.chartColors[1],
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
          },
        },
      });
  
      this.charts[index].instance = chartInstance;
    });
  }
  
  reloadCanvas(chart: any): void {
    const canvasIndex = this.charts.indexOf(chart);
    const canvasElement = this.canvases.toArray()[canvasIndex];
    
    if (canvasElement && canvasElement.nativeElement) {
      const existingChart = Chart.getChart(canvasElement.nativeElement);
      
      if (existingChart) {
        existingChart.destroy();
      }
      
      chart.form.value.showedConfig = false;
      
      let data = this.parseArray(chart.form.value.data);
      let labels = this.parseArray(chart.form.value.labels);
      let title = this.parseArray(chart.form.value.title); 
      const type = chart.form.value.type;
  
      this.snackBar.open(this.translate.instant('Notifications.Update'), this.translate.instant('Notifications.Close'), {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
  
      new Chart(canvasElement.nativeElement, {
        type: type,
        data: {
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: this.chartColors,
              borderColor: this.chartColors[1],
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
          },
        },
      });
    }
  }
  
  deleteCanvas(chart: any): void {
    const index = this.charts.indexOf(chart);
    if (index !== -1) {
      const canvasElement = this.canvases.toArray()[index];
      if (canvasElement && canvasElement.nativeElement) {
        const existingChart = Chart.getChart(canvasElement.nativeElement);
        if (existingChart) {
          existingChart.destroy();
        }
        this.snackBar.open(this.translate.instant('Notifications.Delete'), this.translate.instant('Notifications.Close'), {
          duration: 5000,
          horizontalPosition: 'center', 
          verticalPosition: 'bottom'
        });
        this.charts.splice(index, 1);
        chart.form.reset();
      }
    }
  }

  createCanvasForm(
    canvas: string,
    type: string = 'bar',
    name: string = `#${this.counter} Bar`,
    title: string = 'Bar',
    data: number[] = [1, 2],
    labels: string[] = ['Red', 'Blue']
  ): FormGroup {
    this.counter++;
    let createdCanvas = this.fb.group({
      canvas: [this.counter],
      type: [type, Validators.required],
      name: [name, Validators.required],
      title: [title, Validators.required],
      data: [data, Validators.required],
      labels: [labels, Validators.required],
      showedConfig: [false, Validators.required],
    });
    this.charts.push({ form: createdCanvas });
    setTimeout(()=>{
      this.createCharts();
    }, 0)
    return createdCanvas;
  };

  parseArray(input: any): any[] {
    if (typeof input === 'string') {
      return input.split(',').map((item: string) => item.trim());
    }
    return Array.isArray(input) ? input : [];
  }
  
  addNext(): void {
    const newForm = this.createCanvasForm(
      `canvas-${this.counter}`,
      'bar',
      `#${this.counter} Bar`,
      'Bar',
      [1,2],
      ['Red', 'Blue']
    );
    this.snackBar.open(this.translate.instant('Notifications.Add'), this.translate.instant('Notifications.Close'), {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  loadDefault(){
    this.initializeForms();
  }

  getDataFromPageable(){
    const dialogRef = this.dialog.open(SelectableComponent, {
      width: '70vw',
      height: '80vh',
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.apiCaller.getPageable(result).subscribe((res:any)=>{
          if(res){
            res.forEach((x:any)=>this.createCanvasForm('x', x.type, x.name, x.title, x.data, x.labels))
          }
        })
      }
    });
  }
  
}
