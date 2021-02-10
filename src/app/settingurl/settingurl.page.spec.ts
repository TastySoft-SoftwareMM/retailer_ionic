import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SettingurlPage } from './settingurl.page';

describe('SettingurlPage', () => {
  let component: SettingurlPage;
  let fixture: ComponentFixture<SettingurlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingurlPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingurlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
