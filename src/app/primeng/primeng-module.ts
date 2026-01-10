import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@NgModule({
  exports: [
    CardModule,
    ProgressSpinnerModule,
    ImageModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    DividerModule,
    ConfirmDialogModule
  ],
})
export class PrimengModule { }
