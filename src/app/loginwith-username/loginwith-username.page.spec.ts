import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginwithUsernamePage } from './loginwith-username.page';

describe('LoginwithUsernamePage', () => {
  let component: LoginwithUsernamePage;
  let fixture: ComponentFixture<LoginwithUsernamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginwithUsernamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginwithUsernamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
