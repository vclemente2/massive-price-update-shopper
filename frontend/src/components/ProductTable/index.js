import './ProductTable.css';

const ProductTable = ({ data }) => {
    const hasErrors = data.errors.some((error) => error.length > 0);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Preço Atual</th>
                    <th>Novo Preço</th>
                    {hasErrors && <th>Erro</th>}
                </tr>
            </thead>
            <tbody>
                {data.products.map((product, index) => (
                    <tr key={index} className={data.errors[index].length > 0 ? 'error' : ''}>
                        <td>{product[0].code}</td>
                        <td>{product[0].name}</td>
                        <td>{formatPrice(product[0].sales_price)}</td>
                        <td>{formatPrice(data.newSalesPrice[index])}</td>
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
