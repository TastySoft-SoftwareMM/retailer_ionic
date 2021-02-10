import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomAlertInputPage } from './custom-alert-input.page';

describe('CustomAlertInputPage', () => {
  let component: CustomAlertInputPage;
  let fixture: ComponentFixture<CustomAlertInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAlertInputPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomAlertInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
