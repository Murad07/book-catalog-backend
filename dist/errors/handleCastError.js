"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (error) => {
    const errors = [
        {
            path: error.path,
            message: 'Invalid Id',
        },
    ];
    const statusCode = 400;
    const stack = error.stack;
    return {
        statusCode,
        message: 'Cast Error',
        errorMessages: errors,
        stack,
    };
};
exports.default = handleCastError;
