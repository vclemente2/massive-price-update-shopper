import fs from 'fs/promises';
import connection from '../connection/index.js';
import productSchema from '../schema/productSchema.js';

export const validateProducts = async (req, res) => {
    const { path } = req.file;
    const data = {
        columnTitle: [],
        codes: [],
        newSalesPrice: [],
        products: [],
        errors: []
    }

    try {
        const fileData = ((await fs.readFile(path)).toString()).trim();

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
                data.newSalesPrice.push(parseFloat(arr[1]));
            } else {
                data.codes.push(parseInt(arr[1]));
                data.newSalesPrice.push(parseFloat(arr[0]));
            }
        })

        const validate = productSchema.validate(data);
        if (validate.error) throw new Error(validate.error.message);

        await Promise.all(data.codes.map(async (code) => {
            const productExists = await connection.from('products').leftJoin('packs', 'products.code', 'packs.pack_id').where('products.code', code);
            if (!productExists.length) throw new Error(`No product was found with the code ${code}`)
            data.products.push(productExists);
        }))

        for (let i = 0; i < data.products.length; i++) {
            const product = data.products[i][0]
            const newPrice = data.newSalesPrice[i]

            data.errors.push([])
            if (product.cost_price > newPrice) data.errors[i].push('Não é permitido que o produto esteja com valor abaixo do preço de custo')

            if (
                newPrice < product.sales_price * 0.9 ||
                newPrice > product.sales_price * 1.1
            ) data.errors[i].push('O novo valor do produto não pode variar mais do que 10% em relação ao valor atual')

            if (product.product_id) {

                for (let y = 0; y < data.products[i].length; y++) {
                    const productInPack = data.products[i][y].product_id
                    if (!data.codes.includes(productInPack)) {
                        data.errors[i].push(`Todos os itens vinculados a um pack pricisam estar listados no arquivo de atualização de preços`)
                    }
                }

            }
        }

        return res.status(201).json(data);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const updateProducts = async (req, res) => {
    const data = req.body

    try {

        const arrQuery = []
        for (let i = 0; i < data.products.length; i++) {
            const code = data.products[i][0].code;
            const newSalesPrice = data.newSalesPrice[i];

            const query = `WHEN ${code} THEN ${newSalesPrice}`

            arrQuery.push(query)
        }

        const updatedProducts = await connection('products')
            .whereIn('code', data.codes)
            .update({
                sales_price: connection.raw(`
                 CASE code
                     ${arrQuery.join('\n')}
                     ELSE sales_price
                 END
                `)
            })

        if (!updatedProducts) return res.status(500).json({ message: 'Internal server error.' })

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
}
