import * as APIPaths from '@constants/api_path_constants';
import { Router } from 'express';
import videoRoutes from './videos'

const router = Router();

router.use(APIPaths.ROUTER_VIDEO, videoRoutes)

export default router;