import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MerchTaskModalPage } from './merch-task-modal.page';

describe('MerchTaskModalPage', () => {
  let component: MerchTaskModalPage;
  let fixture: ComponentFixture<MerchTaskModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchTaskModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MerchTaskModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
