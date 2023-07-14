import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookController } from './book.controller';
import { BookValidaion } from './book.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enmus/user';
const router = express.Router();

router.post(
  '/create-book',
  // auth(ENUM_USER_ROLE.SELLER),
  validateRequest(BookValidaion.createBookZodSchema),
  BookController.createBook
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  BookController.getSingleBook
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  BookController.getAllBooks
);

router.delete('/:id', auth(ENUM_USER_ROLE.SELLER), BookController.deleteBook);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(BookValidaion.updateBookZodSchema),
  BookController.updateBook
);

export const BookRoutes = router;
