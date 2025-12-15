import { Routes } from '@angular/router';
import { guestGuard } from '../../shared/guards/guest.guard';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/templates/auth-layout/auth-layout.component').then(
        m => m.AuthLayoutComponent
      ),
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];

