import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: PostListComponent},
  { path:'create', component: PostCreateComponent, canActivate:[AuthGuard]},
  { path:'edit/:postId', component: PostCreateComponent, canActivate:[AuthGuard]},
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
  // loadChildren takes a string that describes to the path you want to load lazily for older versions of angular
  // the old syntax would be => loadChildren:"auth/auth.module#AuthModule"

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
