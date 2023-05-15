import { useState } from 'react';
import './InputFile.css'

const InputFile = () => {
    const [file, setFile] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/products/validade', {
                    method: 'POST',
                    body: formData
                });

                console.log(response)

            } catch (error) {

            }
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <div className="inputfile">
            <form onSubmit={handleSubmit}>
                <h1>Atualizador de Preços</h1>
                <fieldset>
                    <legend>Carregar Arquivo (extensão .csv)</legend>
                    <input type="file" accept=".csv" required onChange={handleFileChange} />
                    <input type="submit" value="VALIDAR" />
                </fieldset>
            </form>
        </div>
    );
}

export default InputFile
