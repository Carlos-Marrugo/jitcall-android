import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactInsertFormPage } from './contact-insert-form.page';

const routes: Routes = [
  {
    path: '',
    component: ContactInsertFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactInsertFormPageRoutingModule {}
