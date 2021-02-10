import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventorystockPage } from './inventorystock.page';

describe('InventorystockPage', () => {
  let component: InventorystockPage;
  let fixture: ComponentFixture<InventorystockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorystockPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventorystockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
