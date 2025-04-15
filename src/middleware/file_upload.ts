import multer from 'multer'
import logger from '../logger'

const ERROR_FILE_FILTER = 'ERROR_FILE_FILTER'
const TAG = 'middlewares.file_upload'
export const upload = multer({
  limits: {
    fileSize: 1*1024 * 1024 * 1024, //1gb
    fieldNameSize: 200 // bytes
  }
})

export const fileReader = function (fieldName: string): any {

    return function (req: any, res, next): any {
      upload.single(fieldName)(req, res, function (err) {
        if (!err) {
          // Everything went fine.
          next()
        } else if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          logger.info(`${TAG}.fileReader(): Multer error.`, err)
          res.status(400).send({ error: err.message })
        } else {
          if (err.name === ERROR_FILE_FILTER){
            res.status(400).send({ error: err.message })
          } else {
            // An unknown error occurred when uploading.
            logger.error(`${TAG}.fileReader(): Unknown error.`, err)
            res.status(500).send({ error: 'Technical Issues' })
          }
        }
      })
    }
  }