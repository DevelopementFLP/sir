import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Observable, finalize } from "rxjs";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(private ngxUiLoader: NgxUiLoaderService) {}

    private _activeRequest = 0;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if(this._activeRequest === 0)
            this.ngxUiLoader.start();

        this._activeRequest++;

        
        console.log(req.url)

        return next.handle(req).pipe(finalize(() => this.stopLoader()));
    }

    private stopLoader(): void {
        this._activeRequest--;
        if(this._activeRequest === 0)
            this.ngxUiLoader.stop();
    }
}