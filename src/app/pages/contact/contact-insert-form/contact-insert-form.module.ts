import { NgModule } from '@angular/core';
import { ContactInsertFormPageRoutingModule } from './contact-insert-form-routing.module';
import { ContactInsertFormPage } from './contact-insert-form.page';

import { SharedModule } from '@shared/shared.module';

@NgModule({

	imports: [

		SharedModule,
		ContactInsertFormPageRoutingModule

	], declarations: [ContactInsertFormPage]

}) export class ContactInsertFormPageModule {}