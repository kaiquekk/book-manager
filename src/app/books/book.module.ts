import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { BookListComponent } from './book-list.component';
import { BookDetailComponent } from './book-detail.component';


@NgModule({
  declarations: [
    BookListComponent,
    BookDetailComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: 'books', component: BookListComponent },
      { path: 'books/:isbn', component: BookDetailComponent }
    ]),
    SharedModule
  ]
})
export class BookModule { }
