export enum ResponseStatus {
    Ok = 'Ok',
    Error = 'Error',
}

export class Response {
    constructor(
        private status: ResponseStatus,
        private description: string,
        private requestId?: string,
    ) {}

    public get Status() {
        return this.status;
    }

    public get Description() {
        return this.description;
    }

    public get RequestId() {
        return this.requestId;
    }
}
