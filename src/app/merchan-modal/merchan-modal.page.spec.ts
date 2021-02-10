import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MerchanModalPage } from './merchan-modal.page';

describe('MerchanModalPage', () => {
  let component: MerchanModalPage;
  let fixture: ComponentFixture<MerchanModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchanModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MerchanModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
