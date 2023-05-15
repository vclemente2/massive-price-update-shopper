import { useState } from 'react';

const UpdateButton = ({ data }) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleUpdate = async () => {
        try {

            const response = await fetch('http://localhost:3001/products/update', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 204) {
                setSuccess(true);
            } else {
                setError(true);
            }
        } catch (error) {
            setError(true);
        }
    };

    const handleOk = () => {
        setSuccess(false);
        setError(false);
        window.location.reload();
    };

    return (
        <div>
            {success && (
                <div>
                    <p>Atualização bem sucedida!</p>
                    <button onClick={handleOk}>Ok</button>
                </div>
            )}

            {error && (
                <div>
                    <p>Erro ao atualizar.</p>
                    <button onClick={handleOk}>Ok</button>
                </div>
            )}

            {!success && !error && <button onClick={handleUpdate}>Atualizar</button>}
        </div>
    );
};

export default UpdateButton
