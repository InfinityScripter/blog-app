import {validationResult} from "express-validator";

export default (err, req, res, next) => {
    console.log(err)
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: 'Ошибка валидации'
        })

    }
    next()
}
