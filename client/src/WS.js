import React, { Component } from 'react';
const WebSocket = require('websocket').w3cwebsocket;

class WS extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      receivedMessage: '',
      showModal: false,
    };

    this.ws = null;
  }

  componentDidMount() {
    this.ws = new WebSocket('ws://localhost:5001');

    this.ws.onopen = () => {
      console.log('Conexão estabelecida com o servidor WebSocket.');
    };

    this.ws.onmessage = (event) => {
      console.log('Mensagem WebSocket recebida:', event.data);

      const receivedMessagePromise = event.data instanceof Blob
        ? event.data.text()
        : Promise.resolve(event.data);

      receivedMessagePromise.then((receivedMessage) => {
        this.setState({ receivedMessage, showModal: true });

        setTimeout(() => {
          this.setState({ showModal: false });
        }, 3000);
      });
    };

    this.ws.onclose = () => {
      console.log('Conexão WebSocket fechada.');
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  handleInputChange = (event) => {
    this.setState({ message: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.sendMessage();
  };

  sendMessage = () => {
    this.ws.send(this.state.message);
    this.setState({ message: '' });
  };

  render() {
    const { message, receivedMessage, showModal } = this.state;

    return (
      <div className="adicionar-tarefa">
        <h2>WebSocket</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={this.handleInputChange}
          />
          <button type="submit">Enviar</button>
        </form>
        <h2>Mensagem Recebida: {receivedMessage}</h2>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>{receivedMessage}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default WS;
