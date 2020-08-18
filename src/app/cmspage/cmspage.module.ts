import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CmspageRoutingModule } from './cmspage-routing.module';
import { ContactFormComponent } from './contact-form/contact-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CmspageRoutingModule
  ],
  declarations: [ContactFormComponent]
})
export class CmspageModule { }
