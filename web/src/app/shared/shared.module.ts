import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { LeftnavComponent } from './layout/leftnav/leftnav.component';



@NgModule({
  declarations: [FooterComponent, HeaderComponent, LeftnavComponent],
  exports:[FooterComponent,HeaderComponent, LeftnavComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
