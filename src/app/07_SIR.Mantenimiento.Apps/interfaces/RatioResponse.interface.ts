import { RatioErrorResponse } from './RatioErrorResponse.interface';

export class RatioResponse {
    data:       RatioErrorResponse[] = [];
    isSucces:   boolean = false;
    message:    string = "";
}