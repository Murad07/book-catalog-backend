import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidaion } from './review.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enmus/user';
const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(ReviewValidaion.createReviewZodSchema),
  ReviewController.createReview
);

// router.get('/:id', ReviewController.getSingleReview);
router.get('/:id', ReviewController.getAllReviews);

export const ReviewRoutes = router;
