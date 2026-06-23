import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let router: Router;
  let navigateCalledWith: string[] | null = null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, FormsModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    router.navigate = ((commands: any[]) => {
      navigateCalledWith = commands;
      return Promise.resolve(true);
    }) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to home on valid mock credentials', () => {
    component.email = 'test@example.com';
    component.password = 'password123';

    component.onSubmit({
      invalid: false,
    } as any);

    expect(navigateCalledWith).toEqual(['/home']);
  });
});
