import React, { Component } from 'react';

class Tarefa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: '',
            queueSize: 0,
            modalVisible: false,
        };
    }

    handleInputChange = (event) => {
        this.setState({ task: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/tarefa');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log('Tarefa adicionada com sucesso');
                this.showModal();
            } else {
                console.error('Erro ao adicionar tarefa');
            }
        };
        xhr.onerror = () => {
            console.error('Erro ao adicionar tarefa');
        };
        xhr.send(JSON.stringify({ task: this.state.task }));

        this.setState({ task: '' });
    };

    showModal = () => {
        this.setState({ modalVisible: true }, () => {
            setTimeout(() => {
                this.hideModal();
            }, 3000);
        });
    };

    getQueueSize = async () => {
        try {
            const response = await fetch('/fila');
            const data = await response.json();
            this.setState({ queueSize: data.queueSize });
        } catch (error) {
            console.error('Erro ao obter o tamanho da fila:', error);
        }
    };

    componentDidMount() {
        this.getQueueSize();
        this.interval = setInterval(this.getQueueSize, 5000); 
    }

    componentWillUnmount() {
        clearInterval(this.interval); 
    }

    hideModal = () => {
        this.setState({ modalVisible: false });
    };

    render() {
        const { task, queueSize, modalVisible } = this.state;

        return (
            <div className="adicionar-tarefa">
                <h2>Adicionar Tarefa</h2>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        value={task}
                        onChange={this.handleInputChange}
                    />
                    <button type="submit">Adicionar</button>
                </form>
                {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={this.hideModal}>
                                &times;
                            </span>
                            <p>Tarefa adicionada com sucesso!</p>
                        </div>
                    </div>
                )}

                <h2>Tamanho da Fila: {queueSize}</h2>
            </div>
        );
    }
}

export default Tarefa;
