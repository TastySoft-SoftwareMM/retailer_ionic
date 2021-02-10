import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MerchModalViewPage } from './merch-modal-view.page';

describe('MerchModalViewPage', () => {
  let component: MerchModalViewPage;
  let fixture: ComponentFixture<MerchModalViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchModalViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MerchModalViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
