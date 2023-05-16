import { useState } from 'react';
import Popup from '../Popup';
import './UpdateButton.css';

const UpdateButton = ({ data }) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleUpdate = async () => {
        try {
            const response = await fetch('http://localhost:3001/products/update', {
                method: 'PUT',
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

    const handlePopupClose = () => {
        setSuccess(false);
        setError(false);
        window.location.reload();
    };

    return (
        <div className="update-button">
            {success && (
                <div>
                    <div className="overlay" />
                    <Popup message="Atualização bem sucedida!" onClose={handlePopupClose} />
                </div>
            )}

            {error && (
                <div>
                    <div className="overlay" />
                    <Popup message="Erro ao atualizar." onClose={handlePopupClose} />
                </div>
            )}

            {!success && !error && <button onClick={handleUpdate}>Atualizar</button>}
        </div>
    );
};

export default UpdateButton;
