const { validationResult } = require('express-validator');

const validator = (req, res, next) => {
    const result = validationResult(req);
    if(result.isEmpty())
       return next();
    res.status(400).json({ errors: result.array() });
}

module.exports = validator;