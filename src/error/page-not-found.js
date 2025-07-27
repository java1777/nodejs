import { AppError } from "./AppError.js";

export const pageError = (_req, _res, next) => {
    throw next(new AppError('Page is not found', 404))
}