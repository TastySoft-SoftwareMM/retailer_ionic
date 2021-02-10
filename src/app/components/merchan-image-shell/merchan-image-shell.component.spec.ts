import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MerchanImageShellComponent } from './merchan-image-shell.component';

describe('MerchanImageShellComponent', () => {
  let component: MerchanImageShellComponent;
  let fixture: ComponentFixture<MerchanImageShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchanImageShellComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MerchanImageShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
