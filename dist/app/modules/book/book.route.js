"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const book_controller_1 = require("./book.controller");
const book_validation_1 = require("./book.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enmus/user");
const router = express_1.default.Router();
router.post('/create-book', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(book_validation_1.BookValidaion.createBookZodSchema), book_controller_1.BookController.createBook);
router.get('/:id', 
// auth(ENUM_USER_ROLE.USER),
book_controller_1.BookController.getSingleBook);
router.get('/', 
// auth(ENUM_USER_ROLE.USER),
book_controller_1.BookController.getAllBooks);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), book_controller_1.BookController.deleteBook);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), (0, validateRequest_1.default)(book_validation_1.BookValidaion.updateBookZodSchema), book_controller_1.BookController.updateBook);
exports.BookRoutes = router;
