import { Routes } from '@angular/router';
import { authGuard } from './core/presentation/shared/guards/auth.guard';
import { guestGuard } from './core/presentation/shared/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/presentation/features/auth/auth.routes').then(m => m.authRoutes),
    canActivate: [guestGuard]
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/presentation/shared/templates/main-layout/main-layout.component').then(
        m => m.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./core/presentation/features/dashboard/dashboard.component').then(
            m => m.DashboardComponent
          )
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./core/presentation/features/accounts/accounts.component').then(
            m => m.AccountsComponent
          )
      },
      {
        path: 'transfers',
        loadComponent: () =>
          import('./core/presentation/features/transfers/transfers.component').then(
            m => m.TransfersComponent
          )
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./core/presentation/features/payments/payments.component').then(
            m => m.PaymentsComponent
          )
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./core/presentation/features/history/history.component').then(
            m => m.HistoryComponent
          )
      },
      {
        path: 'cards',
        loadComponent: () =>
          import('./core/presentation/features/cards/cards.component').then(m => m.CardsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./core/presentation/features/profile/profile.component').then(
            m => m.ProfileComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
