import { useState, useRef } from 'react';
import Popup from '../Popup';
import './InputFile.css';

const InputFile = ({ onResponse, onValidResponse }) => {
    const [file, setFile] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const inputFileRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:3001/products/validate', {
                    method: 'POST',
                    body: formData,
                });

                const dataResponse = await response.json();

                onResponse(dataResponse);

                if (dataResponse.errors.every((error) => error.length === 0)) {
                    onValidResponse(true);
                } else {
                    onValidResponse(false);
                }
            } catch (error) {
                setErrorMessage('Ocorreu um erro ao processar a solicitação.');
                console.log(error);
            }
        }

        inputFileRef.current.value = null;
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const closeErrorMessage = () => {
        setErrorMessage('');
    };

    return (
        <div className="inputfile">
            <form onSubmit={handleSubmit}>
                <h1>Atualizador de Preços</h1>
                <fieldset>
                    <legend>Carregar Arquivo (extensão .csv)</legend>
                    <input
                        type="file"
                        accept=".csv"
                        required
                        onChange={handleFileChange}
                        ref={inputFileRef}
                    />
                    <input type="submit" value="VALIDAR" />
                </fieldset>
            </form>

            {errorMessage && (
                <Popup onClose={closeErrorMessage} className="popup">
                    <p>{errorMessage}</p>
                    <button onClick={() => window.location.reload()}>OK</button>
                </Popup>
            )}
        </div>
    );
};

export default InputFile;
