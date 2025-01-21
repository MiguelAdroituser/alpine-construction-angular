import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaDTModalesComponent } from './prueba-dtmodales.component';

describe('PruebaDTModalesComponent', () => {
  let component: PruebaDTModalesComponent;
  let fixture: ComponentFixture<PruebaDTModalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaDTModalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebaDTModalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
