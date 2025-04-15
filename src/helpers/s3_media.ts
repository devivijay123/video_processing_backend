import path from 'path'
import log from '../logger'
const TAG = 'helpers.s3_media';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { s3ConnectionLoader } from '@loaders/s3_config';
import * as nodeUtil from 'util';
import { AWS_S3 } from '@config'
import { Readable } from 'stream'

export async function saveFile(file: any, folderName: string, bucketName: string): Promise<any> {
    log.info(`${TAG}.saveFile()`)
    try {
      if(file == null){
        throw new Error("File is empty")
      }
      const fileName = getSanitizedFileName(file?.originalname)
  
      return await saveFileBuffer(file?.buffer, folderName + '/' + fileName, bucketName, fileName)
    } catch (e) {
      log.error(`ERROR occurred in ${TAG}.saveFile()`, e)
      throw e
    }
  }
  export async function saveFileBuffer(fileBuffer: any, filePath: any, bucketName: string, fileName?: string): Promise<any> {
    log.info(`${TAG}.saveFileBuffer()`)
    try {
      const params = {
        Bucket: bucketName,
        Key: filePath,
        Body: fileBuffer
      }
      const command = new PutObjectCommand(params)
      const s3Connection = s3ConnectionLoader()
      const data = await s3Connection.send(command)
      log.debug(`${TAG}.saveFileBuffer() s3 upload response::` + nodeUtil.inspect(data))
      data.savedFileKey = filePath
      data.savedFileName = fileName
      data.savedLocation = getFileUrl(filePath, bucketName)
      return data
    } catch (e) {
      log.error(`ERROR occurred in ${TAG}.saveFileBuffer()`, e)
      throw e
    }
  }

  export function getFileUrl(fileKey: string, bucket: string): string {
    return `https://${bucket}.s3.${AWS_S3.region}.amazonaws.com/${fileKey}`
  }

  export function getSanitizedFileName(fileName: string): string {
    fileName = fileName?.replace(/ /g, '_')
    return Math.floor(Date.now()) + '-' + (fileName || '')
  } 
  export function getFileName(filePath: string): string {
    return path.basename(filePath)
  }
  export async function pipeFile(filePath: string, bucket: string, expressResponse: any): Promise<any> {
    log.info(`${TAG}.pipeFile()`)
    try {
      const path=`convolve_videos/${filePath}`
      console.log("path",path)

      const params = {
        Bucket: bucket,
        Key: path
      }
      const s3client = s3ConnectionLoader()
      const fileStream = await s3client.send(new GetObjectCommand(params))
  
      if (fileStream.Body instanceof Readable) {
        fileStream.Body.once('error', (err) => {
          console.error(`${TAG}.pipeFile() Error downloading s3 file`)
          console.error(err)
        })
        expressResponse.attachment(getFileName(filePath))
        fileStream.Body.pipe(expressResponse)
      }
    } catch (e) {
      log.error(`${TAG}.pipeFile() ERROR occurred `, e)
      throw e
    }
  }