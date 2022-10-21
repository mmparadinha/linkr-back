import { STATUS_CODE } from "../enums/statusCode.js";
import { searchSchema } from "../schemas/searchSchema.js";

export const searchMiddleware = async (req, res, next) => {
    const { search } = req.query;
    const validation = searchSchema.validate(search);

    if (validation.error) {
        return res.status(STATUS_CODE.ERRORBADREQUEST).send(validation.error.details[0].message);
    }

    res.locals.search = validation.value;
    next();
};
