import { AuditInfo, IAuditInfo } from './audit_info'



export type IVideoDetails = IAuditInfo & {
    videofileId: number,
    uid: string,
    fileName: string,
    originalFileName: string,
    contentType: string,
    s3Bucket: string,
    filePath: string,
    fileUrl: string,

}
export class videoDetails extends AuditInfo implements IVideoDetails {
    public videofileId: number
    public uid: string
    public fileName: string
    public originalFileName: string
    public contentType: string
    public s3Bucket: string
    public filePath: string
    public fileUrl: string
 
    constructor(fileName: string,
         videofileId: number,
        uid: string,
        originalFileName: string,
        contentType: string,
        s3Bucket: string,
        filePath: string,
        fileUrl: string,
        createdBy?: number,
        creationTime?: Date,
        lastUpdatedBy?: number,
        lastUpdatedTime?: Date) {
        super(createdBy, creationTime, lastUpdatedBy, lastUpdatedTime);
        this.videofileId = videofileId
        this.fileName = fileName
        this.uid = uid
        this.originalFileName = originalFileName
        this.contentType = contentType
        this.s3Bucket = s3Bucket
        this.filePath = filePath
        this.fileUrl = fileUrl
       
    }

}