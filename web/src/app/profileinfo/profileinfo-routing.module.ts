import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
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
import { UploadComponent } from './upload/upload.component';
import { InviteComponent } from './invite/invite.component';
import { MatchComponent } from './match/match.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { OauthGuard } from '../oauth/oauth.guard';


export const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'searchsummary', component: SearchsummaryComponent },
  { path: 'userprofile', component: UserprofileComponent },
  { path: 'post', component: PostComponent },
  { path: 'message', component: MessageComponent },
  { path: 'promote', component: PromoteComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'invest', component: InvestComponent },
  { path: 'consult', component: ConsultComponent },
  { path: 'bump', component: BumpComponent },
  { path: 'refer', component: ReferComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'invite', component: InviteComponent },
  { path: 'match', component: MatchComponent },
  { path: 'changepassword', component: ChangepasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileinfoRoutingModule { }
