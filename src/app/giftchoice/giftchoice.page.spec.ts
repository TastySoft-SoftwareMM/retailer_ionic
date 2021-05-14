import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GiftchoicePage } from './giftchoice.page';

describe('GiftchoicePage', () => {
  let component: GiftchoicePage;
  let fixture: ComponentFixture<GiftchoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftchoicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GiftchoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
