import { responseApi } from './../../../shared/interfaces/response.interface';
import { AuthService } from './../../services/auth.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../interfaces/login.interface';
import { Router } from '@angular/router';
import { UtilidadService } from '../../../shared/services/utilidad.service';

@Component({
  selector: 'crm-login-component',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = "";
  contrasena: string = "";
  isEmaiil: boolean = false;
  isPassword: boolean = false;
  loginFormulario!: FormGroup;
  token?: string;
  mostrarLoading: boolean = false;
  ocultarPassword: boolean = true;

  constructor(
    private fromBuilder: FormBuilder,
    private AuthService: AuthService,
    private router: Router,
    private utilidad: UtilidadService
  ) {
    this.loginFormulario = this.fromBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  iniciarSesion() {
    //Verificar email con una expresión regular
    const emailPattern = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    this.mostrarLoading= true;
    if (emailPattern.test(this.username) || this.username !== "") {
      console.log(this.username);
      const login: Login = {
        email: this.username,
        contrasena: this.contrasena
      }
      this.AuthService.iniciarSesion(login).subscribe({
        next: (data: responseApi<string>) => {
          if (data.success) {
            this.AuthService.guardarSesión(data.value);
            this.router.navigate(["cotizacion"])
            this.utilidad.mostrarAlerta("Usuario y contraseña correcto", "Bienvenido!");
          } else {
            this.utilidad.mostrarAlerta("No se encontraron coincidencias", "Opps!");
          }
        },
        complete: () => {
          this.mostrarLoading = false;
        },
        error: (error) => {
          if(error.status === 0){
            this.utilidad.mostrarAlerta("No se pudo tener conexión con el servidor", "Error!");
            this.mostrarLoading = false;
          }
          else{
            this.utilidad.mostrarAlerta(`${error.error.message}`, "Opps!");
            this.isEmaiil = true;
            this.isPassword = true;
            this.mostrarLoading = false;
          }
        }
      });
    } else {
      this.isEmaiil = true;
    }

  }

}
