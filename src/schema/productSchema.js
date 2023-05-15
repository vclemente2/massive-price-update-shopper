import joi from 'joi';

const productSchema = joi.object({
    columnTitle: joi.array()
        .items(
            joi.string().valid('product_code', 'new_price').required(),
            joi.string().valid('product_code', 'new_price').required(),
        )
        .length(2)
        .required(),
    codes: joi.array().items(joi.number()).min(1).required(),
    newSalesPrice: joi.array().items(joi.number()).min(1).required(),
    products: joi.array(),
    errors: joi.array()
});

export default productSchema;
