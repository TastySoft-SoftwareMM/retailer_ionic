import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventorycheckPage } from './inventorycheck.page';

describe('InventorycheckPage', () => {
  let component: InventorycheckPage;
  let fixture: ComponentFixture<InventorycheckPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorycheckPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventorycheckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
