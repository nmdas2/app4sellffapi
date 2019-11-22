import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { ProfileinfoRoutingModule } from './profileinfo-routing.module';
import { SearchsummaryComponent } from './searchsummary/searchsummary.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { PostComponent } from './post/post.component';
import { MessageComponent } from './message/message.component';
import { PromoteComponent } from './promote/promote.component';
import { ReviewComponent } from './review/review.component';
import { InvestComponent } from './invest/invest.component';
import { ConsultComponent } from './consult/consult.component';
import { BumpComponent } from './bump/bump.component';
import { ReferComponent } from './refer/refer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MytestingComponent } from './mytesting/mytesting.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UploadComponent } from './upload/upload.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RatingModule, ProgressbarModule, PopoverModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap/alert';
import { InviteComponent } from './invite/invite.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DataTablesModule } from 'angular-datatables';
import { MatchComponent } from './match/match.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ChartModule,HIGHCHARTS_MODULES  } from 'angular-highcharts';
import * as highstock from 'highcharts/modules/stock.src';
import { OauthGuard } from '../oauth/oauth.guard';
import { OAuthInterceptor } from '../oauth/oauth.interceptor';

@NgModule({
  declarations: [
    AboutComponent, 
    SearchsummaryComponent, 
    UserprofileComponent, 
    PostComponent, 
    MessageComponent, 
    PromoteComponent, 
    ReviewComponent, 
    InvestComponent, 
    ConsultComponent, 
    BumpComponent, 
    ReferComponent, 
    MytestingComponent, 
    UploadComponent, InviteComponent, MatchComponent, ChangepasswordComponent
    //,HighchartsChartComponent
  ],
  imports: [
    CommonModule,
    ProfileinfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    HttpClientModule,
    RatingModule.forRoot(),
    ProgressbarModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    DataTablesModule,
    TypeaheadModule.forRoot(),
    HighchartsChartModule,
    ChartModule
  ],
  providers: [
    OauthGuard, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OAuthInterceptor,
      multi: true
    },
    { provide: HIGHCHARTS_MODULES, useFactory: () => [highstock] }
  ]
})
export class ProfileinfoModule { }
