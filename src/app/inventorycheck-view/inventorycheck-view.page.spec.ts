import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventorycheckViewPage } from './inventorycheck-view.page';

describe('InventorycheckViewPage', () => {
  let component: InventorycheckViewPage;
  let fixture: ComponentFixture<InventorycheckViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorycheckViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventorycheckViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
