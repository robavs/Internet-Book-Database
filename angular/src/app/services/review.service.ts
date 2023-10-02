import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { AddReview } from "../models/AddReview";
import { Review } from "../models";

@Injectable(
    { providedIn: 'root' }
)
export class ReviewService {
    errors$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])

    constructor(private http: HttpClient) { }

    addReview(reviewProps: AddReview, readerId: number, bookId: number) {
        try {
            const route = environment.api + "/review/create" + `/${readerId}/${bookId}`
            return this.http.post<Review>(route, reviewProps)
        }
        catch (err: any) {
            throw new Error(err)
        }

    }
}