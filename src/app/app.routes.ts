import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'chronometer', pathMatch: 'full' },
  {
    path: 'chronometer',
    loadComponent: () =>
      import('../app/modules/page/chronometer/chronometer').then((m) => m.Chronometer),
  },
  { path: '**', redirectTo: 'chronometer' },
];
