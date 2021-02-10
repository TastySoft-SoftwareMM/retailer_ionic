import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataPage } from './data.page';

const routes: Routes = [
  {
    path: '',
    component: DataPage,
    children: [
      {
        path: 'sync',
        children: [
          {
            path: '',
            loadChildren: () => import('../sync/sync.module').then( m => m.SyncPageModule)
          }
        ]
      },
      {
        path: 'setting',
        children: [
          {
            path: '',
            loadChildren: () => import('../setting/setting.module').then( m => m.SettingPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/data/sync',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/data/sync',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataPageRoutingModule {}
