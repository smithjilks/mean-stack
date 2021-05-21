import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

  constructor(private dialog: MatDialog){}
  intercept(req: HttpRequest<any>, next: HttpHandler){
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) =>{

        let errorMessage = "An unkown error occurred";
        if(error.message){
          errorMessage = error.message;
        }

        this.dialog.open(ErrorComponent, {data:{message: errorMessage} })
        return throwError(error);
      })
    );
  }

}