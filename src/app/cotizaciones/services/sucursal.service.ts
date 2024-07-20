import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SucursalModalComponent } from '../components/client/sucursal-modal/sucursal-modal.component';
import { envirnoments } from '../../../environments/environments';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Sucursal } from '../interfaces/sucursal.interface';
import { responseApi } from '../../shared/interfaces/response.interface';
import { ClienteService } from './cliente.service';
import { FormArray } from '@angular/forms';

@Injectable({ providedIn: 'root' })

export class SucursalService {
  public baseURL = envirnoments.baseUrl;
  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private clientService: ClienteService
  ) { }

  public openSucursalDetail(id: number | null = null) {
    const dialogRef = this.dialog.open(SucursalModalComponent, {
      data: { idSucursal: id }
    });
  }

  saveSucursal(sucursal: Sucursal) {
    let idCliente = this.clientService.clientForm.get('idCliente');
    sucursal.idCliente = idCliente?.value ?? 0;
    return this.http.post<responseApi<Sucursal>>(`${this.baseURL}/api/Sucursal`, sucursal).pipe(
      tap((data) => {
        this.updateSucursalOnClient(data.value);
      }),
      catchError((e: any) => {
        console.error(e);
        return throwError(e);
      })
    )
  }

  editSucursal(sucursal: Sucursal): Observable<responseApi<Sucursal>> {
    return this.http.put<responseApi<Sucursal>>(`${this.baseURL}/api/Sucursal`, sucursal).pipe(
      tap((data) => {
        console.log(data.value);
        this.updateSucursalOnClient(data.value)
      }),
      catchError((e: any) => {
        console.error(e);
        return throwError(e);
      })
    )
  }

  updateSucursalOnClient(Sucursal: Sucursal): void {
    let sucursals = this.clientService.clientForm.get('sucursals') as FormArray;
    let sucursalFound: Sucursal = sucursals.value.find((s: Sucursal) =>  s.idSucursal === Sucursal.idSucursal );
    if (sucursalFound) {
      sucursals.value.forEach((s: Sucursal, index: number) => {
        if (s.idSucursal === Sucursal.idSucursal) {
          let sucursalArray = sucursals.at(index);
          sucursalArray.patchValue(Sucursal);
        }
      });
    } else {
      sucursals.push(Sucursal);
    }
  }

  deleteSucursal(object: any) {
    return this.http.delete<responseApi<Sucursal>>(`${this.baseURL}/api/Sucursal?id=${object.idSucursal}`).pipe(
      tap((data) => {
        console.log(`Sucursal ${object.nombre} eliminada`);
      }),
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    )
  }
}
