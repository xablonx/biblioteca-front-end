import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivroForm } from './livro-form';

describe('LivroForm', () => {
  let component: LivroForm;
  let fixture: ComponentFixture<LivroForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivroForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivroForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
