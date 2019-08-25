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
import { HttpClientModule } from '@angular/common/http';
import { RatingModule, ProgressbarModule, PopoverModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap/alert';


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
    UploadComponent
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
    AlertModule.forRoot()
  ]
})
export class ProfileinfoModule { }
