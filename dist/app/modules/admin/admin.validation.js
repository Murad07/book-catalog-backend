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
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const admin_constant_1 = require("./admin.constant");
const admin_model_1 = require("./admin.model");
const createAdminZodSchema = zod_1.z
    .object({
    body: zod_1.z
        .object({
        password: zod_1.z.string().optional(),
        name: zod_1.z.object({
            firstName: zod_1.z.string({
                required_error: 'First name is required',
            }),
            lastName: zod_1.z.string({
                required_error: 'Last name is required',
            }),
        }),
        role: zod_1.z.enum([...admin_constant_1.role], {
            required_error: 'Role is required',
        }),
        phoneNumber: zod_1.z.string({
            required_error: 'Phone number is required',
        }),
        address: zod_1.z.string({
            required_error: 'Address is required',
        }),
        profileImage: zod_1.z.string().optional(),
    })
        .refine(value => isUniquePhoneNumber(value.phoneNumber), {
        message: 'Phone number already exists',
        path: ['body', 'phoneNumber'],
    }),
})
    .refine(value => Object.keys(value.body).length > 0, {
    message: 'Request body is empty',
    path: ['body'],
});
const updaeAdminZodSchema = zod_1.z
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
        role: zod_1.z
            .enum([...admin_constant_1.role], {
            required_error: 'Role is required',
        })
            .optional(),
        phoneNumber: zod_1.z.string({
            required_error: 'Phone number is required',
        }),
        address: zod_1.z
            .string({
            required_error: 'Address is required',
        })
            .optional(),
        profileImage: zod_1.z.string().optional(),
    })
        .optional()
        .refine(value => {
        if (value && value.phoneNumber) {
            return isUniquePhoneNumber(value.phoneNumber);
        }
        return true;
    }, {
        message: 'Phone number already exists',
        path: ['body', 'phoneNumber'],
    }),
})
    .refine(value => { var _a; return Object.keys((_a = value.body) !== null && _a !== void 0 ? _a : {}).length > 0; }, {
    message: 'Request body is empty',
    path: ['body'],
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'Phone Number is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
exports.AdminValidation = {
    createAdminZodSchema,
    updaeAdminZodSchema,
    loginZodSchema,
};
function isUniquePhoneNumber(phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield admin_model_1.Admin.findOne({ phoneNumber });
        return admin === null;
    });
}
