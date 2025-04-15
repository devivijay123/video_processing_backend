

export type IAuditInfo = {
    createdBy: number;
    creationTime: Date;
    lastUpdatedBy: number;
    lastUpdatedTime: Date;
}

export class AuditInfo implements IAuditInfo {
    public createdBy: number;
    public creationTime: Date;
    public lastUpdatedBy: number;
    public lastUpdatedTime: Date;

    constructor(createdBy: number,
                creationTime: Date,
                lastUpdatedBy: number,
                lastUpdatedTime: Date) {
        this.createdBy = createdBy;
        this.creationTime = creationTime;
        this.lastUpdatedBy = lastUpdatedBy;
        this.lastUpdatedTime = lastUpdatedTime;
    }
}
