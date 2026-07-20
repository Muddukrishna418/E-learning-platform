import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { Courses as CoursesComponent } from './features/student/courses/courses';
import { CourseDetails as StudentCourseDetailsComponent } from './features/student/course-details/course-details';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { CourseDetailsComponent } from './features/course-details/course-details';
import { authGuard } from './core/guards/auth.guard';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { EnrollPageComponent } from './features/student/enroll/enroll';
import { LearningMaterialComponent } from './features/student/learning-material/learning-material';
import { MyCourses as MyCoursesComponent } from './features/student/my-courses/my-courses';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: LoginComponent
      }
    ]
  },

  {
    path: 'register',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: RegisterComponent
      }
    ]
  },

  {
    path: 'signup',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: RegisterComponent
      }
    ]
  },

  // Home page with navbar only (no sidebar)
  {
    path: 'home',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: Home
      }
    ]
  },

  // Courses page with navbar and sidebar
  {
    path: 'courses',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: CoursesComponent
      }
    ]
  },

  {
    path: 'courses/:id',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: StudentCourseDetailsComponent
      }
    ]
  },

  {
    path: 'enroll/:id',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: EnrollPageComponent
      }
    ]
  },

  {
    path: 'my-courses',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: MyCoursesComponent
      }
    ]
  },

  {
    path: 'student/courses',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: CoursesComponent
      }
    ]
  },

  {
    path: 'student/courses/:id',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: StudentCourseDetailsComponent
      }
    ]
  },

  {
    path: 'courses/:courseId/content/:contentId',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: LearningMaterialComponent
      }
    ]
  },

  {
    path: 'course-details',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: CourseDetailsComponent
      }
    ]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
