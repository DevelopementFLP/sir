import { EagleData } from "./EagleData.interface";

export interface EagleResponse {
    data:       EagleData[];
    isSuccess:  boolean;
    message:    string;
}