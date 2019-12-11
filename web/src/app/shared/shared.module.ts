import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { LeftnavComponent } from './layout/leftnav/leftnav.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SocialLinksComponent } from './layout/social-links/social-links.component';
import { UserNotificationsComponent } from './layout/user-notifications/user-notifications.component';

@NgModule({
  declarations: [
    FooterComponent, 
    HeaderComponent, 
    LeftnavComponent, 
    SocialLinksComponent,  
    UserNotificationsComponent
  ],
  exports:[
    FooterComponent,
    HeaderComponent, 
    LeftnavComponent, 
    SocialLinksComponent,
    UserNotificationsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ]
})
export class SharedModule { }
