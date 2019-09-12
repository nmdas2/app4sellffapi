import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { LeftnavComponent } from './layout/leftnav/leftnav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, LeftnavComponent],
  exports:[FooterComponent,HeaderComponent, LeftnavComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ]
})
export class SharedModule { }
