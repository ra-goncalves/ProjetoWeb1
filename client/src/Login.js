import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            loginErro: false,
            passwordErro: false,
            loginRes: false
        }
    }

    handleSubmitLogin = (event) => {
        event.preventDefault();

        // const xhr = new XMLHttpRequest();
        // xhr.open('POST', '/logar');
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.onload = () => {
        //   if (xhr.status === 200) {
        //     this.state(JSON.parse(xhr.responseText));
        //   } else {
        //     console.log('Erro na requisição.');
        //   }
        // };
        // const dadosEnviados = this.state;
        // xhr.send(JSON.stringify(dadosEnviados));
        if (this.state.login === "") {
            this.setState({
                loginErro: true
            });
            return;
        } else {
            this.checarEmail();
        }

        if (this.state.password === "") {
            this.setState({
                passwordErro: true
            });
            return;
        } else {
            this.setState({
                passwordErro: false
            });
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/logar');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    this.setState({
                        loginRes: true
                    });
                    console.log('Login realizado com sucesso.');
                    // Redirecionar para a página principal
                    window.location.href = '/';
                } else {
                    this.setState({
                        loginRes: true
                    });
                    console.log('Credenciais inválidas.');
                }
            } else {
                this.setState({
                    loginRes: true
                });
                console.log('Erro na requisição.');
            }
        };
        const dadosEnviados = { login: this.state.login, password: this.state.password };
        xhr.send(JSON.stringify(dadosEnviados));

    }

    checarEmail() {
        let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!this.state.login.match(pattern)) {
            this.setState({
                loginErro: true
            });
        } else {
            this.setState({
                loginErro: false
            });
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <>
                <section id="login">
                    <div className="blocker"></div>
                    <div id="campo-form">
                        <header>
                        </header>
                        <h2>Login</h2>
                        <form onSubmit={this.handleSubmitLogin} className="formLogin">
                            <div className="campos email">
                                <div className="area-input">
                                    <input type="text" name="login" value={this.state.login} onChange={this.handleChange} placeholder="E-mail" />
                                    <span className="icone material-symbols-outlined">mail</span>
                                </div>
                                {this.state.loginErro && <div className="erros.erro-msg">O email tem que ser válido e não pode estar em branco</div>}
                            </div>
                            <div className="campos senha">
                                <div className="area-input">
                                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Senha" />
                                    <span className="icone material-symbols-outlined">lock</span>
                                </div>
                                {this.state.passwordErro && <div className="erros.erro-msg">A senha não pode estar em branco</div>}
                            </div>
                            {this.state.loginRes && <div className="erros.erro-msg">Login ou senha invalido</div>}
                            <button type="submit">Login</button>
                            <div className="infoCad">
                                <Link className="infoCad" to={"/cadastro"}>Não tem cadastro? Cadastre-se</Link>
                            </div>
                        </form>
                    </div >
                </section>
            </>
        );
    }
}

export default Login;