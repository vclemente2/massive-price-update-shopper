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
            /*
                Regras:
                - O time Financeiro, preocupado com o faturamento, solicitou que o sistema impeça que o 
                preço de venda dos produtos fique abaixo do custo deles;
                3- O time de Marketing, preocupado com o impacto de reajustes nos clientes, solicitou que o 
                sistema impeça qualquer reajuste maior ou menor do que 10% do preço atual do produto
                4- Alguns produtos são vendidos em pacotes, ou seja, um produto que composto por um ou 
                mais produtos em quantidades diferentes. 
                Estabeleceu-se a regra que, ao reajustar o preço de um pacote, o mesmo arquivo deve 
                conter os reajustes dos preços dos componentes do pacote de modo que o preço final da 
                soma dos componentes seja igual ao preço do pacote.
 
            */


        }

        return res.json(data);

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

        await connection('products')
            .whereIn('code', data.codes)
            .update({
                sales_price: connection.raw(`
                 CASE code
                     ${arrQuery.join('\n')}
                     ELSE sales_price
                 END
                `)
            })

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
}
