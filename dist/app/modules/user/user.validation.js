"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_model_1 = require("./user.model");
const createUserZodSchema = zod_1.z
    .object({
    body: zod_1.z
        .object({
        password: zod_1.z.string().optional(),
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
    })
        .refine(value => isUniqueemail(value.email), {
        message: 'Email already exists',
        path: ['body', 'email'],
    }),
})
    .refine(value => Object.keys(value.body).length > 0, {
    message: 'Request body is empty',
    path: ['body'],
});
const updaeUserZodSchema = zod_1.z
    .object({
    body: zod_1.z
        .object({
        password: zod_1.z.string().optional(),
        name: zod_1.z
            .object({
            firstName: zod_1.z
                .string({
                required_error: 'First name is required',
            })
                .optional(),
            lastName: zod_1.z
                .string({
                required_error: 'Last name is required',
            })
                .optional(),
        })
            .optional(),
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
    })
        .optional()
        .refine(value => {
        if (value && value.email) {
            return isUniqueemail(value.email);
        }
        return true;
    }, {
        message: 'Phone number already exists',
        path: ['body', 'email'],
    }),
})
    .refine(value => { var _a; return Object.keys((_a = value.body) !== null && _a !== void 0 ? _a : {}).length > 0; }, {
    message: 'Request body is empty',
    path: ['body'],
});
exports.UserValidation = {
    createUserZodSchema,
    updaeUserZodSchema,
};
function isUniqueemail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.User.findOne({ email });
        return user === null;
    });
}
