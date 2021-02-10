import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {
  profile = [
    { id: 1, shopsyskey: "stk-2443", username: 'Kari Spicy Noodle', price: 2000, amount: 1, image: 'https://sc01.alicdn.com/kf/UTB84RyAXwQydeJk43PUq6AyQpXap/Assorted-Curry-Instant-Noddle.jpg_640x640.jpg' },
    { id: 2, shopsyskey: "stk-4543", username: 'Migoreng Fried', price: 3000, amount: 1, image: 'https://photos1.blogger.com/blogger/628/3358/320/indomie.gif' },
    { id: 3, shopsyskey: "stk-2323", username: 'Kari Beef Noodle', price: 2500, amount: 1, image: 'https://st1.myideasoft.com/idea/ek/90/myassets/products/806/indomie-hazir-noddle-tavuk-cesnili-70gr-2427818.jpeg?revision=1575092835' },
    { id: 4, shopsyskey: "stk-6433", username: 'Korea Hazir Noodle ', price: 2500, amount: 1, image: 'https://st1.myideasoft.com/idea/ek/90/myassets/products/797/indomie-hazir-noddle-kizarmis-cesnili-80gr-2427820.jpg?revision=1574988717' }
  ];

  usershop = [
    { id: 1, name: "Rossmann", image: 'https://www.stop-shop.com/images/module/2005.jpg', status: 'pending' },
    { id: 1, name: "William Hill", image: 'https://ichef.bbci.co.uk/news/410/cpsprodpb/C110/production/_107742494_williamhill_getty.jpg', status: 'incomplete' },
    { id: 1, name: "Top Shop", image: 'https://lh3.googleusercontent.com/proxy/jj5jZ4W56_EUlE1FxLGMx2whhb0fWSEFc-JA89ngVkUIQmfDmE-naVAifZ-rYNZxbalq1KZC3gGOfBuRQi_wKrtzTICcoVFgJN1mPFybITrYUKjLWZLhUdGetmF5TQqEbW7J4jz_FCzoRk9shRD90ZafGsdM1A', status: 'pending' },
    { id: 1, name: "Wai Phyo Thar(Yuzana Plaza)", image: 'https://www.goldenplacemyanmar.com/wp-content/themes/default/thumb.php?src=http://www.goldenplacemyanmar.com/wp-content/uploads//96e37a7b0c77640fdd53345b703f3f21.jpg&w=800&h=600&zc=3&a=c&q=100&bid=1', status: 'pending' },
    { id: 1, name: "Rossmann", image: 'https://www.stop-shop.com/images/module/2005.jpg', status: 'pending' },
    { id: 1, name: "William Hill", image: 'https://ichef.bbci.co.uk/news/410/cpsprodpb/C110/production/_107742494_williamhill_getty.jpg', status: 'incomplete' },
    { id: 1, name: "Top Shop", image: 'https://lh3.googleusercontent.com/proxy/jj5jZ4W56_EUlE1FxLGMx2whhb0fWSEFc-JA89ngVkUIQmfDmE-naVAifZ-rYNZxbalq1KZC3gGOfBuRQi_wKrtzTICcoVFgJN1mPFybITrYUKjLWZLhUdGetmF5TQqEbW7J4jz_FCzoRk9shRD90ZafGsdM1A', status: 'pending' },
    { id: 1, name: "Wai Phyo Thar(Yuzana Plaza)", image: 'https://www.goldenplacemyanmar.com/wp-content/themes/default/thumb.php?src=http://www.goldenplacemyanmar.com/wp-content/uploads//96e37a7b0c77640fdd53345b703f3f21.jpg&w=800&h=600&zc=3&a=c&q=100&bid=1', status: 'pending' },
  ]
  constructor() { }

  getProfile() {
    return this.profile;
  }
  getUserShop() {
    return this.usershop;
  }
}
