import {Router} from 'express';

import imageHandlingRoutes from './image-handling';
import nearbyServicesRoutes from './nearby-services';
import policyParsingRoutes from './policy-parsing';

const router = Router();

router.use('/image-handling', imageHandlingRoutes);
router.use('/nearby-services', nearbyServicesRoutes);
router.use('/policy-parsing', policyParsingRoutes);

export default router;
