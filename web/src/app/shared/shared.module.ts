import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { LeftnavComponent } from './layout/leftnav/leftnav.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [FooterComponent, HeaderComponent, LeftnavComponent],
  exports:[FooterComponent,HeaderComponent, LeftnavComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
