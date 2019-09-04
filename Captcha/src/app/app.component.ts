import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  highcharts = Highcharts;
chartOptions = {   
      chart: {
         type: "spline"
      },
      title: {
         text: "Monthly Average Temperature"
      },
      subtitle: {
         text: "Source: WorldClimate.com"
      },
      xAxis:{
         categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      yAxis: {          
         title:{
            text:"Temperature °C"
         } 
      },
      tooltip: {
         valueSuffix:" °C"
      },
      series: [
         {
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2,26.5, 23.3, 18.3, 13.9, 9.6]
         }
      ]
   };


  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
}
