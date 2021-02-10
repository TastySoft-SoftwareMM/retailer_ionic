import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReturnproudctPage } from './returnproduct.page';

describe('ReturnproudctPage', () => {
  let component: ReturnproudctPage;
  let fixture: ComponentFixture<ReturnproudctPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnproudctPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnproudctPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
