import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TestDataModel } from './gateway.model';

@Injectable()
export class GatewayService {
    public static isRawApiResponse(object: any): object is RawApiResponse<any> {
        return (
            !!object &&
            typeof object === 'object' &&
            ('RetCode' in object && 'RetMessage' in object && 'Data' in object)
        );
    }

    constructor(private http: HttpClient) {}

    public getTestData(): Observable<TestDataModel[]> {
        return this.get({
            apiModule: 'Test',
            operation: 'GetTestData'
        });
    }

    private get<T>(apiQuery: ApiQuery): Observable<T> {
        return this.http.get(this.formatUrl(apiQuery)).pipe(
            map(this.extractData),
            catchError(err => this.handleError<T>(err))
        );
    }

    private delete<T>(apiQuery: ApiQuery): Observable<T> {
        return this.http.delete(this.formatUrl(apiQuery)).pipe(
            map(this.extractData),
            catchError(err => this.handleError<T>(err))
        );
    }

    private post<T>(
        apiQuery: ApiQuery,
        body?: any,
        contentType?: string
    ): Observable<T> {
        const headers = contentType
            ? {
                  'Content-Type': contentType
              }
            : {};
        return this.http
            .post(this.formatUrl(apiQuery), body, {
                headers
            })
            .pipe(
                map(this.extractData),
                catchError(err => this.handleError<T>(err))
            );
    }

    private put<T>(apiQuery: ApiQuery, body?: any): Observable<T> {
        return this.http.put(this.formatUrl(apiQuery), body).pipe(
            map(this.extractData),
            catchError(err => this.handleError<T>(err))
        );
    }

    private handleError<T>(
        error: HttpErrorResponse | RawApiResponse<T>
    ): Observable<any> {
        if (GatewayService.isRawApiResponse(error)) {
            // Custom error, marked by "RetCode !== 'OK'"
            // let the caller handle it
            alert(error.RetMessage);
            return throwError(error.RetMessage);
        }
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred.
            alert(`An error occurred: ${error.error.message}`);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            alert(
                `An error occurred when requesting ${error.url}: ${
                    error.status
                } ${error.statusText}. Please try refreshing the page.`
            );
        }
        return throwError(`A network or backend error happened`);
    }

    private extractData<T>(raw: RawApiResponse<T>) {
        if (raw.RetCode === 'OK') {
            return raw.Data;
        } else {
            throw raw;
        }
    }

    private formatUrl(apiQuery: ApiQuery) {
        const query = {
            operation: `${apiQuery.apiModule}.${apiQuery.operation}`,
            ...apiQuery.extraQuery
        };
        return `/api/?${Object.keys(query)
            .map(key => `${key}=${query[key]}`)
            .join('&')}`;
    }
}

interface ApiQuery {
    apiModule: string;
    operation: string;
    extraQuery?: { [key: string]: string };
}

export interface RawApiResponse<T> {
    RetCode: 'OK' | 'Error';
    RetMessage: string;
    Data: T;
}
