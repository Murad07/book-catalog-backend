"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enmus/user");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(review_validation_1.ReviewValidaion.createReviewZodSchema), review_controller_1.ReviewController.createReview);
// router.get('/:id', ReviewController.getSingleReview);
router.get('/:id', review_controller_1.ReviewController.getAllReviews);
exports.ReviewRoutes = router;
