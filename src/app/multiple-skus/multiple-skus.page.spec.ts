import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultipleSkusPage } from './multiple-skus.page';

describe('MultipleSkusPage', () => {
  let component: MultipleSkusPage;
  let fixture: ComponentFixture<MultipleSkusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleSkusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleSkusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
