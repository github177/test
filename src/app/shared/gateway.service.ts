import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { AjaxRequest, AjaxResponse } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";

/**
 * A service for calling gateway APIs.
 * @example
 * try {
 *     lxcas = this.gateway.getLxcaList().toPromise();
 * } catch (e) {
 *     switch ((e as RawApiResponse).RetMessage) {
 *         case "custom error 1":
 *             // handle error 1
 *         default:
 *             // handle normal errors (or just return)
 *     }
 * }
 */
@Injectable()
export class GatewayService {
    private readonly feature = "TestAngular";

    public static isRawApiResponse(object: any): object is RawApiResponse<any> {
        return (
            !!object &&
            typeof object === "object" &&
            ("RetCode" in object && "RetMessage" in object && "Data" in object)
        );
    }

    private getNode(): string {
        return `test.com`;
    }

    constructor(private http: HttpClient) {}

    // public getTestData(isAllowed: boolean): Observable<void> {
    //     return this.put(
    //         {
    //             apiModule: "Misc",
    //             operation: "SetUsageDataAuthorization"
    //         },
    //         {
    //             authorized: isAllowed
    //         }
    //     );
    // }

    public getTestData(): Observable<void> {
        return this.get({
            apiModule: "Test",
            operation: "GetTestData"
        });
    }

    private get<T>(apiQuery: ApiQuery): Observable<T> {
        return this.http.get(this.formatUrl(apiQuery), {}).pipe(
            map(this.extractData),
            catchError(err => this.handleError<T>(err))
        );
    }

    private delete<T>(apiQuery: ApiQuery): Observable<T> {
        return this.http.delete(this.formatUrl(apiQuery), {}).pipe(
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
                  "Content-Type": contentType
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
        return this.http.put(this.formatUrl(apiQuery), body, {}).pipe(
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
            return throwError(error);
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

    private extractData<T>(raw: AjaxResponse): T {
        const response = raw.response as RawApiResponse<T>;
        if (response.RetCode === "OK") {
            return response.Data;
        } else {
            throw response;
        }
    }

    private formatUrl(apiQuery: ApiQuery) {
        const query = {
            operation: `${apiQuery.apiModule}.${apiQuery.operation}`,
            ...apiQuery.extraQuery
        };
        return `/api/nodes/${this.getNode()}/features/${
            this.feature
        }/?${Object.keys(query)
            .map(key => `${key}=${query[key]}`)
            .join("&")}`;
    }
}

interface ApiQuery {
    apiModule: string;
    operation: string;
    extraQuery?: { [key: string]: string };
}

export interface RawApiResponse<T> {
    RetCode: "OK" | "Error";
    RetMessage: string;
    Data: T;
}
