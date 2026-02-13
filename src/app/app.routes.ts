import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'timer-setup', pathMatch: 'full' },
  {
    path: 'chronometer',
    loadComponent: () =>
      import('./modules/page/chronometer/chronometer').then((m) => m.Chronometer),
  },
  {
    path: 'timer-setup',
    loadComponent: () =>
      import('./modules/page/timer-setup/timer-setup').then((m) => m.TimerSetupComponent),
  },
  { path: '**', redirectTo: 'timer-setup' },
];
