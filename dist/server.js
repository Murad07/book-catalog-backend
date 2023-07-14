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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./config/index"));
// const port: number = 5000;
process.on('uncaughtException', error => {
    // console.log(error);
    console.log(error);
    process.exit(1);
});
let server;
// database connection
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(index_1.default.database_url);
            // console.log('Database connection successfull');
            console.log('Database connection successfull');
            server = app_1.default.listen(index_1.default.port, () => {
                // console.log(`Server listening on port ${config.port}`);
                console.log(`Server listening on port ${index_1.default.port}`);
            });
        }
        catch (err) {
            // console.log('Failed to connect database', err);
            console.log('Failed to connect database', err);
        }
        process.on('unhandledRejection', error => {
            if (server) {
                server.close(() => {
                    // console.log(error);
                    console.log(error);
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    });
}
main();
process.on('SIGTERM', () => {
    // console.log('SIGTERM is received');
    console.log('SIGTERM is received');
    if (server) {
        server.close();
    }
});
