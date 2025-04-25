import { NgModule } from '@angular/core';
import { ContactUpdateFormPageRoutingModule } from './contact-update-form-routing.module';
import { ContactUpdateFormPage } from './contact-update-form.page';

import { SharedModule } from '@shared/shared.module';

@NgModule({

	imports: [

		SharedModule,
		ContactUpdateFormPageRoutingModule

	], declarations: [ContactUpdateFormPage]

}) export class ContactUpdateFormPageModule {}