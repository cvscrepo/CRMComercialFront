import { NgModule } from '@angular/core';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { CommonModule } from '@angular/common';
import { AuthRoutinMolude } from './auth-routing.module';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginComponent } from './components/login/login.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@NgModule({
  exports: [],
  declarations: [
    LayoutPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutinMolude,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class AuthModule { }
