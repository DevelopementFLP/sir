export interface BrokerDataResult {
    extraData:          ExtraData[];
    grossWeight:        string;
    id:                 number;
    mosaicCode:         string;
    netWeight:          string;
    productCode:        string;
    productDescription: string;
}

export interface ExtraData {
    name:  string;
    value: string;
}
