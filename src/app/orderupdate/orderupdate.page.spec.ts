import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderupdatePage } from './orderupdate.page';

describe('OrderupdatePage', () => {
  let component: OrderupdatePage;
  let fixture: ComponentFixture<OrderupdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderupdatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderupdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
