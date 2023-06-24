import React, { useState } from 'react';

function Redis() {
  const [chave, setChave] = useState('');
  const [valor, setValor] = useState('');
  const [busca, setBusca] = useState('');
  const [resultado, setResultado] = useState('');

  const handleArmazenarChave = () => {
    fetch('/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chave, valor }),
    })
      .then((response) => {
        if (response.ok) {
          setResultado('Chave armazenada com sucesso!');
        } else {
          setResultado('Falha ao armazenar a chave.');
        }
      })
      .catch((error) => {
        console.error(error);
        setResultado('Erro ao comunicar com o servidor.');
      });
  };

  const handleBuscarChave = () => {
    fetch(`/keys/${busca}`)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          setResultado('Chave não encontrada.');
        }
      })
      .then((data) => {
        setResultado(data);
      })
      .catch((error) => {
        console.error(error);
        setResultado('Erro ao comunicar com o servidor.');
      });
  };

  return (
    <div className="adicionar-tarefa">
      <h2>Armazenar e Buscar Chave no Redis</h2>

      <div className="adicionar-tarefa">
        <input
          type="text"
          placeholder="Chave"
          value={chave}
          onChange={(e) => setChave(e.target.value)}
        />
        <input
          type="text"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <button onClick={handleArmazenarChave}>Armazenar Chave</button>
      </div>

      <div className="adicionar-tarefa">
        <input
          type="text"
          placeholder="Buscar Chave"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button onClick={handleBuscarChave}>Buscar Chave</button>
      </div>

      <div className="adicionar-tarefa">
        <h3>Resultado:</h3>
        {resultado ? <p>{resultado}</p> : <p>Nenhuma chave encontrada.</p>}
      </div>
    </div>
  );
}

export default Redis;
