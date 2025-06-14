import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { StudentDashboardComponent } from './modules/student/student-dashboard/student-dashboard.component';
import { FacultyDashboardComponent } from './modules/faculty/faculty-dashboard/faculty-dashboard.component';
import { CollegeDetailsComponent } from './modules/admin/college-details/college-details.component'; // Import the component
import { AddPersonComponent } from './modules/admin/add-person/add-person.component'; // Import the component
import { AddAchievementComponent } from './modules/student/add-achievement/add-achievement.component';
import { ViewProgressComponent } from './modules/student/view-progress/view-progress.component';
import { StudentProfileComponent } from './modules/student/student-profile/student-profile.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input'; 
import { MarkupdationComponent } from './modules/faculty/markupdation/markupdation.component';
import { AddFacultyComponent } from './modules/admin/add-faculty/add-faculty.component';
import { AddClassAdvisorComponent } from './modules/admin/add-class-advisor/add-class-advisor.component';
import { AddSubjectToFacultyComponent } from './modules/admin/add-subject-to-faculty/add-subject-to-faculty.component';
import { GraceMarkApprovalComponent } from './modules/classadvisor/grace-mark-approval/grace-mark-approval.component';
import { ClassAdvisorDashboardComponent } from './modules/classadvisor/class-advisor-dashboard/class-advisor-dashboard.component';
import { MarksReportComponent } from './modules/classadvisor/marks-report/marks-report.component';
import { AddSubjectStudentsComponent } from './modules/admin/add-subject-students/add-subject-students.component';
import { FacultyProfileComponent } from './modules/faculty/faculty-profile/faculty-profile.component';
import { ClassadvisorProfileComponent } from './modules/classadvisor/classadvisor-profile/classadvisor-profile.component';
import { GraceMarkReportComponent } from './modules/classadvisor/grace-mark-report/grace-mark-report.component';
import { ActivityLogsComponent } from './modules/admin/activity-logs/activity-logs.component';
import { FeedbackFormsComponent } from './modules/faculty/feedback-forms/feedback-forms.component';
import { ViewFeedbackComponent } from './modules/admin/view-feedback/view-feedback.component';
import { FeedbackCformsComponent } from './modules/classadvisor/feedback-cforms/feedback-cforms.component';
import { FeedbackSformsComponent } from './modules/student/feedback-sforms/feedback-sforms.component';
import { FqasPageForStudentsComponent } from './modules/student/fqas-page-for-students/fqas-page-for-students.component';
import { FqasPageForFacultyComponent } from './modules/faculty/fqas-page-for-faculty/fqas-page-for-faculty.component';
import { FqasPageForClassadvisorComponent } from './modules/classadvisor/fqas-page-for-classadvisor/fqas-page-for-classadvisor.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { RulesComponent } from './modules/student/rules/rules.component';
import { DashboardComponent } from './modules/classadvisor/dashboard/dashboard.component';
import { SdashboardComponent } from './modules/student/sdashboard/sdashboard.component';
import { FdashboardComponent } from './modules/faculty/fdashboard/fdashboard.component';
import { AdashboardComponent } from './modules/admin/adashboard/adashboard.component';
import { AdsRulesComponent } from './modules/classadvisor/ads-rules/ads-rules.component';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent
      // children: [ 
      //   { path: 'forget-password', component: ForgetPasswordComponent}
      // ]
     },

     { path: 'forget-password', component: ForgetPasswordComponent },

    { 
      path: 'admin-dashboard', 
      component: AdminDashboardComponent, 
      children: [
        { path: '', redirectTo: 'adashboard', pathMatch: 'full' },
        { path: 'adashboard', component: AdashboardComponent },
        { path: 'college-details', component: CollegeDetailsComponent },
        { path: 'add-person', component: AddPersonComponent },
        { path: 'add-faculty', component: AddFacultyComponent },
        { path: 'add-class-advisor', component: AddClassAdvisorComponent },
        { path: 'add-subjects-to-faculty', component: AddSubjectToFacultyComponent },
        { path: 'add-subjects-to-students', component: AddSubjectStudentsComponent },
        { path: 'activity-logs', component: ActivityLogsComponent },
        { path: 'view-feedback', component: ViewFeedbackComponent }
      ]
    },
    { 
      path: 'student-dashboard', 
      component: StudentDashboardComponent, 
      children: [
        { path: '', redirectTo: 'sdashboard', pathMatch: 'full' },
        { path: 'sdashboard', component: SdashboardComponent },
        { path: 'studentprofile', component: StudentProfileComponent },
        { path: 'Rules', component: RulesComponent },
        { path: 'addachievements', component: AddAchievementComponent },
        { path: 'viewprogress', component: ViewProgressComponent },
        { path: 'feedback-sforms', component: FeedbackSformsComponent },
        { path: 'fqa-students', component: FqasPageForStudentsComponent }
      ]
    },
    { path: 'faculty-dashboard', component: FacultyDashboardComponent,
      children: [
        { path: '', redirectTo: 'fdashboard', pathMatch: 'full' },
        { path: 'fdashboard', component: FdashboardComponent },
        { path: 'markupdation', component: MarkupdationComponent },
        { path: 'faculty-profile', component: FacultyProfileComponent },
        { path: 'feedback-forms', component: FeedbackFormsComponent },
        { path: 'fqa-faculty', component: FqasPageForFacultyComponent }
      ]
     },

     { path: 'class-advisor', component: ClassAdvisorDashboardComponent,
      children: [
        { path: '', redirectTo: 'cdashboard', pathMatch: 'full' },
       { path: 'gracemarkapproval', component: GraceMarkApprovalComponent },
       { path: 'cdashboard', component: DashboardComponent },
       { path: 'ads-rules', component: AdsRulesComponent },
       { path: 'marks-report', component: MarksReportComponent },
       { path: 'advisor-profile', component: ClassadvisorProfileComponent },
       { path: 'grace-mark-report', component: GraceMarkReportComponent },
       { path: 'feedback-cforms', component: FeedbackCformsComponent },
       { path: 'fqa-classadvisor', component: FqasPageForClassadvisorComponent }
      ]
     },

  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes), MatDatepickerModule,
      MatNativeDateModule,
      MatInputModule],
    providers: [
      provideHttpClient()  
    ],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }