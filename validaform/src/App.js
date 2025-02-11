import React from 'react';
import './index.css';  // Estilização global
import Form from './components/Form';  // Importação do seu formulário

function App() {
  return (
    <div className="App">
      <h1>Cadastro de Usuário</h1>
      <Form />
    </div>
  );
}

export default App;
