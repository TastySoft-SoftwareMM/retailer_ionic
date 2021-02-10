import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MerchandizingViewPage } from './merchandizing-view.page';

describe('MerchandizingViewPage', () => {
  let component: MerchandizingViewPage;
  let fixture: ComponentFixture<MerchandizingViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchandizingViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MerchandizingViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
