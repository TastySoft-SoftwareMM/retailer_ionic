import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderPlacementPage } from './order-placement.page';

describe('OrderPlacementPage', () => {
  let component: OrderPlacementPage;
  let fixture: ComponentFixture<OrderPlacementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPlacementPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPlacementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
