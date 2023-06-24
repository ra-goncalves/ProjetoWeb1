import React, { Component } from 'react';

class Cadastro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            login: '',
            password: ''
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/users');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log('Usuário cadastrado!');
                document.getElementById('resCadastro').innerHTML = 'Usuário cadastrado!';
                window.location.href = '/';
            } else {
                console.log('Falha ao cadastrar.');
                document.getElementById('resCadastro').innerHTML = 'Falha ao cadastrar.';
            }
        };
        xhr.send(JSON.stringify(this.state));
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <section id="cadastro">
                <div className="blocker"></div>
                <div id="campo-form2">
                    <header>
                    </header>
                    <h2>Cadastro</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="campos nome">
                            <div className="area-input">
                                <input
                                    type="text"
                                    name="username"
                                    id="iusername"
                                    placeholder="Nome de usuário"
                                    required
                                    value={this.state.username}
                                    onChange={this.handleInputChange}
                                />
                                <span className="icone material-symbols-outlined">person</span>
                            </div>
                        </div>
                        <div className="campos email">
                            <div className="area-input">
                                <input
                                    type="email"
                                    name="login"
                                    id="iemailCad"
                                    placeholder="E-mail"
                                    required
                                    value={this.state.login}
                                    onChange={this.handleInputChange}
                                />
                                <span className="icone material-symbols-outlined">mail</span>
                                <span className="erros icone-erro material-symbols-outlined">error</span>
                            </div>
                            {this.state.cadErro && <div className="erros erro-msg">O email não pode estar em branco</div>}
                        </div>
                        <div className="campos senha">
                            <div className="area-input">
                                <input
                                    type="password"
                                    name="password"
                                    id="ipasswordCad"
                                    placeholder="Senha"
                                    required
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                />
                                <span className="icone material-symbols-outlined">lock</span>
                                <span className="erros icone-erro material-symbols-outlined">error</span>
                            </div>
                            <div className="erros erro-msg">A senha não pode estar em branco</div>
                        </div>
                        <input type="submit" value="Cadastrar" />
                        <div id="resCadastro"></div>
                    </form>
                </div>
            </section>
        );
    }
}

export default Cadastro;
