import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockImageViewerPage } from './stock-image-viewer.page';

describe('StockImageViewerPage', () => {
  let component: StockImageViewerPage;
  let fixture: ComponentFixture<StockImageViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockImageViewerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockImageViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
