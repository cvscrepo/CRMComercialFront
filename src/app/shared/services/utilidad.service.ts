import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class UtilidadService {

  constructor(private _snackBar:MatSnackBar) { }

  mostrarAlerta(mensaje:string, tipo:string, verticalPosition :MatSnackBarVerticalPosition = "top", horizontalPosition: MatSnackBarHorizontalPosition = "end" ){
    this._snackBar.open(mensaje,tipo, {
      horizontalPosition: horizontalPosition,
      verticalPosition:verticalPosition,
      duration:5000
    })
  }

}
