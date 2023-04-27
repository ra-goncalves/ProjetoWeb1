import React, { Component } from "react";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titulo: "",
            conteudo: "",
            image: null,
            erros: [],
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === "file" ? target.files[0] : target.value;

        this.setState({
            [name]: value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append("titulo", this.state.titulo);
        formData.append("conteudo", this.state.conteudo);
        formData.append("image", this.state.image);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/cadastrar_noticia");
        xhr.onload = () => {
            if (xhr.status === 200) {
                alert("Notícia cadastrada com sucesso!");
                this.setState({
                    titulo: "",
                    conteudo: "",
                    image: null,
                    erros: [],
                });
            } else {
                const erros = JSON.parse(xhr.responseText).erros;
                this.setState({ erros: erros });
            }
        };
        xhr.send(formData);
    }

    render() {
        return (
            <section className="noticias">
                <div id="blockern">
                    <div className="area-noticias">
                        <form
                            className="form-noticias"
                            encType="multipart/form-data"
                            onSubmit={this.handleSubmit}
                        >
                            <h3>Cadastrar uma notícia</h3>
                            <div id="n-1" className="campos">
                                <label htmlFor="ititulo">Título</label>
                                <input
                                    type="text"
                                    id="ititulo"
                                    name="titulo"
                                    value={this.state.titulo}
                                    onChange={this.handleInputChange}
                                    required
                                />
                                {this.state.erros.includes("titulo") && (
                                    <div className="erros erro-msg">O titulo não pode estar em branco</div>
                                )}
                            </div>
                            <div id="n-2" className="campos">
                                <label htmlFor="iconteudo">Conteúdo</label>
                                <textarea
                                    id="iconteudo"
                                    name="conteudo"
                                    rows="10"
                                    cols="100"
                                    value={this.state.conteudo}
                                    onChange={this.handleInputChange}
                                    required
                                />
                                {this.state.erros.includes("conteudo") && (
                                    <div className="erros erro-msg">O conteúdo não pode estar em branco</div>
                                )}
                            </div>
                            <div id="fileImg">
                                <label htmlFor="txtImage">Imagem</label>
                                <input type="file" name="image" onChange={this.handleInputChange} />
                            </div>
                            <div id="n-3">
                                <input type="submit" value="Postar" />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        );
    }
}

export default Home;