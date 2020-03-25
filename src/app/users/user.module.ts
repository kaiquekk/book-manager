import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ListComponent } from './list.component';


@NgModule({
  declarations: [
      ProfileComponent,
      ListComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: 'users/:id/list', component: ListComponent },
      { path: 'users/:id/profile', component: ProfileComponent }
    ]),
    SharedModule
  ]
})
export class UserModule { }
