import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { HighchartsChartComponent } from 'highcharts-angular';

@NgModule({
  declarations: [
    AppComponent,
    HighchartsChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RecaptchaModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
