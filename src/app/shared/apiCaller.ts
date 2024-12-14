import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable()
export class ApiCaller {
    readonly APIUrl = environment.apiUrl ?? '';
    private typeName: string = "";

    constructor(private http: HttpClient) {
    }
    public setControllerPath(controllerPath: string) {
        this.typeName = controllerPath;
    }
    getListTest(): Observable<any[]> {
        return this.http.get<any>(this.APIUrl + this.typeName+'/pageabletest');
    }
    getSelectable(): Observable<any[]> {
        return this.http.get<any>(this.APIUrl + this.typeName+'/selectable');
    }
    getItem(itemId: any): Observable<any[]> {
        return this.http.get<any>(this.APIUrl + this.typeName+'/'+itemId);
    }
    getPageable(params: {}): Observable<any[]> {
        return this.http.get<any>(this.APIUrl + this.typeName+'/pageable', {params: params });
    }
      
}
