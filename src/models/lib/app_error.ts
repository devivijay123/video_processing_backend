export class AppError extends Error {
    public httpCode?: number
    public errors?: []
    public additionalInfo?: string

    constructor(message,httpCode?, errors?, additionalInfo?, ) {
        super(message)
        this.errors = errors
        this.httpCode = httpCode
        this.additionalInfo = additionalInfo
    }
}