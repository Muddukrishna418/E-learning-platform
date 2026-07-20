import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Home } from './home';
import { CourseService } from '../../core/services/course-data.service';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    const courseServiceSpy = jasmine.createSpyObj('CourseService', ['getCourses']);
    courseServiceSpy.getCourses.and.returnValue([
      {
        id: '1',
        title: 'Full-Stack Web Development',
        description: 'Learn modern web technologies from scratch.',
        duration: '8 weeks',
        level: 'Beginner',
        category: 'Development',
        logo: 'WEB',
        rating: '4.9 ★'
      }
    ]);

    const authSpy = jasmine.createSpyObj('Auth', [], { isAuthenticated$: of(false) });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: CourseService, useValue: courseServiceSpy },
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should search courses by title and display matching results', () => {
    component.searchTerm = 'web';
    component.searchCourses();

    expect(component.hasSearched).toBeTrue();
    expect(component.searchResults.length).toBe(1);
    expect(component.searchResults[0].title).toContain('Web');
  });
});
