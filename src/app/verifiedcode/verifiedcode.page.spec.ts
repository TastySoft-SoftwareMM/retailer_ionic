import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifiedcodePage } from './verifiedcode.page';

describe('VerifiedcodePage', () => {
  let component: VerifiedcodePage;
  let fixture: ComponentFixture<VerifiedcodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifiedcodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifiedcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
