import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProImageViewerPage } from './pro-image-viewer.page';

describe('ProImageViewerPage', () => {
  let component: ProImageViewerPage;
  let fixture: ComponentFixture<ProImageViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProImageViewerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProImageViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
