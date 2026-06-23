import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { Courses as CoursesComponent } from './features/student/courses/courses';
import { CourseDetails as StudentCourseDetailsComponent } from './features/student/course-details/course-details';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { CourseDetailsComponent } from './features/course-details/course-details';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },

  {
    path: 'courses',
    component: CoursesComponent
  },

  {
    path: 'courses/:id',
    component: StudentCourseDetailsComponent
  },

  {
    path: 'student/courses',
    component: CoursesComponent
  },

  {
    path: 'student/courses/:id',
    component: StudentCourseDetailsComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'signup',
    component: RegisterComponent
  },

  {
    path: 'course-details',
    component: CourseDetailsComponent
  },

  {
    path: '**',
    redirectTo: ''
  }
];
