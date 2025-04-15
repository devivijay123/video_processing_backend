import { Router } from "express";
import * as controller from '@controller/videos';
import multer from 'multer'
import { fileReader } from "@middleware/file_upload";
import { FormParams } from "@constants/api_param_constants";

const router = Router();



router.route('/upload')
    .post(fileReader(FormParams.FILE_FIELD),controller.saveVideo)
router.route('/upload/:filePath')
    .get(controller.getS3FileByFilePath)

export default router;