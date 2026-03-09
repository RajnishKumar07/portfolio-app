import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/dashboard/components/portfolio-form/portfolio-form').then(m => m.PortfolioFormComponent), canDeactivate: [unsavedChangesGuard] },
      { path: 'edit/:slug', loadComponent: () => import('./features/dashboard/components/portfolio-form/portfolio-form').then(m => m.PortfolioFormComponent), canDeactivate: [unsavedChangesGuard] }
    ]
  },
  { path: 'p/:slug', component: HomeComponent }
];
