import { Router } from 'express';
import { roleController } from '../../controllers';

//ROLE ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//ROLE LIST
_router.route('/list').get(roleController.getAllRole);

export const router = _router;
