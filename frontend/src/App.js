import React, { useState } from 'react';
import InputFile from './components/InputFile';
import ProductTable from './components/ProductTable';
import UpdateButton from './components/UpdateButton';

function App() {
  const [responseData, setResponseData] = useState();
  const [shouldUpdate, setShouldUpdate] = useState(false)

  const handleResponse = (data) => {
    setResponseData(data);
  };

  const showUpdateButton = (boolean) => {
    setShouldUpdate(boolean)
  }

  return (
    <div className="App">
      <InputFile
        onResponse={handleResponse}
        onValidResponse={showUpdateButton}
      />
      {shouldUpdate && <UpdateButton data={responseData} />}
      {responseData && <ProductTable data={responseData} />}
    </div>
  );
}

export default App;
