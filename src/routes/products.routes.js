import { Router } from 'express';
import * as productsCtrl from '../controllers/products.controller';
import { authJWT } from '../middlewares';

const router = Router();

router.get('/', productsCtrl.getProducts);

router.get('/:productId', productsCtrl.getProductById);

router.post(
  '/',
  [authJWT.verifyToken, authJWT.isModerator],
  productsCtrl.createProduct
);

router.put(
  '/:productId',
  [authJWT.verifyToken, authJWT.isAdmin],
  productsCtrl.updateProductById
);

router.delete(
  '/:productId',
  [authJWT.verifyToken, authJWT.isAdmin],
  productsCtrl.deleteProductById
);

export default router;
