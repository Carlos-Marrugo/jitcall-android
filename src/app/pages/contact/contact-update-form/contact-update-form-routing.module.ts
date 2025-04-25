import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactUpdateFormPage } from './contact-update-form.page';

const routes: Routes = [
  {
    path: '',
    component: ContactUpdateFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactUpdateFormPageRoutingModule {}
