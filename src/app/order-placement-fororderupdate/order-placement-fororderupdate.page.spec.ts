import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderPlacementFororderupdatePage } from './order-placement-fororderupdate.page';

describe('OrderPlacementFororderupdatePage', () => {
  let component: OrderPlacementFororderupdatePage;
  let fixture: ComponentFixture<OrderPlacementFororderupdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPlacementFororderupdatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPlacementFororderupdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
