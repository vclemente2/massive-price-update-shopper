import { useState } from 'react';
import './InputFile.css'

const InputFile = ({ onResponse, onValidResponse }) => {
    const [file, setFile] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:3001/products/validate', {
                    method: 'POST',
                    body: formData
                });

                const dataResponse = await response.json()
                onResponse(dataResponse)

                if (dataResponse.errors.every((error) => error.length === 0)) {
                    onValidResponse(true);
                } else {
                    onValidResponse(false);
                }



            } catch (error) {
                /*
                    IMPLEMENTAR
                */
                console.log(error)
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
