import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShoptransferPage } from './shoptransfer.page';

describe('ShoptransferPage', () => {
  let component: ShoptransferPage;
  let fixture: ComponentFixture<ShoptransferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoptransferPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoptransferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
