import React, { Component } from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            senha: '',
            emailCad: '',
            senhaCad: '',
            loginErro: false,
            cadastroErro: false
        }
    }

    handleSubmitLogin = (event) => {
        event.preventDefault();

        if (this.state.email === "") {
            this.setState({
                loginErro: true
            });
            return;
        } else {
            this.checarEmail();
        }

        if (this.state.senha === "") {
            this.setState({
                loginErro: true
            });
            return;
        } else {
            this.setState({
                loginErro: false
            });
        }
    }

    handleSubmitCadastro = (event) => {
        event.preventDefault();

        if (this.state.emailCad === "") {
            this.setState({
                cadastroErro: true
            });
            return;
        } else {
            this.checarEmailCad();
        }

        if (this.state.senhaCad === "") {
            this.setState({
                cadastroErro: true
            });
            return;
        } else {
            this.setState({
                cadastroErro: false
            });
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    checarEmailCad() {
        let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!this.state.emailCad.match(pattern)) {
            this.setState({
                cadastroErro: true
            });
        } else {
            this.setState({
                cadastroErro: false
            });
        }
    }



    render() {
        return (
            <>
                <section id="cadastro">
                    <div className="blocker"></div>
                    <div id="campo-form">
                        <header>
                        </header>
                        <h2>Cadastro</h2>
                        <form onSubmit={this.handleSubmitCadastro} id="iCadastros">
                            <div className="campos email">
                                <div className="area-input">
                                    <input type="text" name="emailCad" value={this.state.emailCad} onChange={this.handleChange} placeholder="E-mail" />
                                    <span className="icone material-symbols-outlined">mail</span>
                                </div>
                                {this.state.cadastroErro && <div className="erro-msg">O email tem que ser válido e não pode estar em branco</div>}
                            </div>
                            <div className="campos senha">
                                <div className="area-input">
                                    <input type="password" name="senhaCad" value={this.state.senhaCad} onChange={this.handleChange} placeholder="Senha" />
                                    <span className="icone material-symbols-outlined">lock</span>
                                </div>
                                {this.state.cadastroErro && <div className="erro-msg">A senha não pode estar em branco</div>}
                            </div>
                            <button type="submit">Cadastrar</button>
                        </form>
                    </div >
                </section>
            </>
        );
    }
}