import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShopmodalPage } from './shopmodal.page';

describe('ShopmodalPage', () => {
  let component: ShopmodalPage;
  let fixture: ComponentFixture<ShopmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopmodalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
