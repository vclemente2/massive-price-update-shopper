import fs from 'fs/promises';
import connection from '../connection/index.js';
import productSchema from '../schema/productSchema.js';

export const validateProducts = async (req, res) => {
    const { path } = req.file;
    const data = {
        columnTitle: [],
        codes: [],
        salesPrice: [],
        products: [],
        errors: []
    }

    try {
        const fileData = (await fs.readFile(path)).toString();

        const arrData = fileData.replaceAll('\r', '').split(`\n`);

        data.columnTitle = arrData[0].split(',');

        if (
            !data.columnTitle.includes('product_code') ||
            !data.columnTitle.includes('new_price')
        ) {
            throw new Error('For the update to be possible, the CSV file must contain the fields "product_code" and "new_price"');
        }

        arrData.splice(0, 1);

        arrData.forEach((value) => {
            const arr = value.split(',');
            if (data.columnTitle[0] === 'product_code') {
                data.codes.push(parseInt(arr[0]));
                data.salesPrice.push(parseFloat(arr[1]));
            } else {
                data.codes.push(parseInt(arr[1]));
                data.salesPrice.push(parseFloat(arr[0]));
            }
        })

        const validate = productSchema.validate(data);
        if (validate.error) throw new Error(validate.error.message);

        await Promise.all(data.codes.map(async (code) => {
            const productExists = await connection('products').where({ code }).first();
            if (!productExists) throw new Error(`No product was found with the code ${code}`)
            data.products.push(productExists);
        }))

        return res.json(data);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const updateProducts = async (req, res) => {

    try {
        // const fileData = (await fs.readFile(path)).toString();

        // const arrData = fileData.replaceAll('\r', '').split(`\n`);

        // const set = arrData[0];

        // arrData.splice(0, 1);

        // const codes = [];
        // const values = (arrData.map((value) => {
        //     const arr = value.split(',');
        //     const code = arr[0];
        //     codes.push(code)
        //     const salesPrice = arr[1];
        //     return `WHEN ${code} THEN ${salesPrice}`
        // })).join("\n");

        const updatedProducts = await connection('products')
            .whereIn('code', codes)
            .update({
                sales_price: connection.raw(`
                 CASE code
                     ${values}
                     ELSE sales_price
                 END
                `)
            })

        // if (!updatedProducts) return res.status(404).json({ message: 'No products were found for the codes entered' })

        // const packs = await connection('packs')
        //     .select(['pack_id', 'qty'])
        //     .whereIn('product_id', codes)

        return res.json(packs)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
}
