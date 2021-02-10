import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataPageModule } from './data/data.module';
import { DataPage } from './data/data.page';

const routes: Routes = [
  { path: '', redirectTo: 'login_username', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
    , canLoad: []
  },
  {
    path: 'verified',
    loadChildren: () => import('./verifiedcode/verifiedcode.module').then(m => m.VerifiedcodePageModule)
  },
  {
    path: 'data',
    loadChildren: () => import('./data/data.module').then(m => m.DataPageModule)
  },
  {
    path: 'sync',
    loadChildren: () => import('./sync/sync.module').then(m => m.SyncPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then(m => m.SettingPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainPageModule)
  },
  {
    path: 'login_username',
    loadChildren: () => import('./loginwith-username/loginwith-username.module').then(m => m.LoginwithUsernamePageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'checkin',
    loadChildren: () => import('./checkin/checkin.module').then(m => m.CheckinPageModule)
  },
  {
    path: 'settingurl',
    loadChildren: () => import('./settingurl/settingurl.module').then(m => m.SettingurlPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule)
  },
  {
    path: 'inventorycheck',
    loadChildren: () => import('./inventorycheck/inventorycheck.module').then(m => m.InventorycheckPageModule)
  },
  {
    path: 'inventorycheck:/id',
    loadChildren: () => import('./inventorycheck/inventorycheck.module').then(m => m.InventorycheckPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'shoptransfer',
    loadChildren: () => import('./shoptransfer/shoptransfer.module').then(m => m.ShoptransferPageModule)
  },
  {
    path: 'cart-item',
    loadChildren: () => import('./cart-item/cart-item.module').then(m => m.CartItemPageModule)
  },
  {
    path: 'order-placement',
    loadChildren: () => import('./order-placement/order-placement.module').then(m => m.OrderPlacementPageModule)
  },
  {
    path: 'order-list',
    loadChildren: () => import('./order-list/order-list.module').then(m => m.OrderListPageModule)
  },
  {
    path: 'merchandizing',
    loadChildren: () => import('./merchandizing/merchandizing.module').then(m => m.MerchandizingPageModule)
  },
  {
    path: 'merchan-modal',
    loadChildren: () => import('./merchan-modal/merchan-modal.module').then(m => m.MerchanModalPageModule)
  },
  {
    path: 'inventorystock',
    loadChildren: () => import('./inventorystock/inventorystock.module').then(m => m.InventorystockPageModule)
  },
  {
    path: 'shop-detail/:id/:syskey',
    loadChildren: () => import('./shop-detail/shop-detail.module').then(m => m.ShopDetailPageModule)
  },
  {
    path: 'returnproduct',
    loadChildren: () => import('./returnproduct/returnproduct.module').then(m => m.ReturnproudctPageModule)
  },
  {
    path: 'orderupdate/:orderno',
    loadChildren: () => import('./orderupdate/orderupdate.module').then(m => m.OrderupdatePageModule)
  },
  {
    path: 'order-placement-update',
    loadChildren: () => import('./order-placement-update/order-placement-update.module').then(m => m.OrderPlacementUpdatePageModule)
  },
  {
    path: 'shopmodal',
    loadChildren: () => import('./shopmodal/shopmodal.module').then(m => m.ShopmodalPageModule)
  },
  {
    path: 'image-viewer',
    loadChildren: () => import('./image-viewer/image-viewer.module').then(m => m.ImageViewerPageModule)
  },
  {
    path: 'cart-summary',
    loadChildren: () => import('./cart-summary/cart-summary.module').then(m => m.CartSummaryPageModule)
  },
  {
    path: 'merch-task-modal',
    loadChildren: () => import('./merch-task-modal/merch-task-modal.module').then(m => m.MerchTaskModalPageModule)
  },
  {
    path: 'order-placement-fororderupdate',
    loadChildren: () => import('./order-placement-fororderupdate/order-placement-fororderupdate.module').then(m => m.OrderPlacementFororderupdatePageModule)
  },
  {
    path: 'order-detail/:id',
    loadChildren: () => import('./order-detail/order-detail.module').then(m => m.OrderDetailPageModule)
  },
  {
    path: 'merchandizing-view',
    loadChildren: () => import('./merchandizing-view/merchandizing-view.module').then(m => m.MerchandizingViewPageModule)
  },
  {
    path: 'merch-modal-view',
    loadChildren: () => import('./merch-modal-view/merch-modal-view.module').then(m => m.MerchModalViewPageModule)
  },
  {
    path: 'inventorycheck-view',
    loadChildren: () => import('./inventorycheck-view/inventorycheck-view.module').then(m => m.InventorycheckViewPageModule)
  },
  {
    path: 'stock-image-viewer',
    loadChildren: () => import('./stock-image-viewer/stock-image-viewer.module').then(m => m.StockImageViewerPageModule)
  },
  {
    path: 'camera',
    loadChildren: () => import('./camera/camera.module').then(m => m.CameraPageModule)
  },
  {
    path: 'pro-image-viewer/:syskey',
    loadChildren: () => import('./pro-image-viewer/pro-image-viewer.module').then(m => m.ProImageViewerPageModule)
  },
  {
    path: 'invoice-discount-detail',
    loadChildren: () => import('./invoice-discount-detail/invoice-discount-detail.module').then(m => m.InvoiceDiscountDetailPageModule)
  },
  {
    path: 'custom-alert-input',
    loadChildren: () => import('./custom-alert-input/custom-alert-input.module').then(m => m.CustomAlertInputPageModule)
  },
  {
    path: 'multiple-skus',
    loadChildren: () => import('./multiple-skus/multiple-skus.module').then(m => m.MultipleSkusPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutPageModule)
  },
  {
    path: 'checkout-orderupdate/:orderno',
    loadChildren: () => import('./checkout-orderupdate/checkout-orderupdate.module').then( m => m.CheckoutOrderupdatePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
