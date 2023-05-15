const ProductTable = ({ data }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Preço Atual</th>
                    <th>Novo Preço</th>
                    {data.errors.some((error) => error.length > 0) && <th>Erros</th>}
                </tr>
            </thead>
            <tbody>
                {data.products.map((product, index) => (
                    <tr key={index}>
                        <td>{product[0].code}</td>
                        <td>{product[0].name}</td>
                        <td>{product[0].sales_price}</td>
                        <td>{data.newSalesPrice[index]}</td>
                        {data.errors[index].length > 0 && (
                            <td>{data.errors[index].join(', ')}</td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProductTable;
