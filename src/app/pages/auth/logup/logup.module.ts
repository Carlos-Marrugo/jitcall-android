import { NgModule } from '@angular/core';
import { LogupPageRoutingModule } from './logup-routing.module';
import { LogupPage } from './logup.page';

import { SharedModule } from '@shared/shared.module';

@NgModule({

	imports: [

		SharedModule,
		LogupPageRoutingModule

	], declarations: [LogupPage]

}) export class LogupPageModule {}
