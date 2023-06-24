import React, { Component } from 'react';

class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noticias: [],
      searchTerm: '',
      searchError: null
    };
  }

  handleSearchTermChange = async (event) => {
    const termo = event.target.value;
    this.setState({ searchTerm: termo });
  }

  searchNoticias = async (termo) => {
    if (termo.length <= 2) {
      return [];
    }
    try {
      const response = await fetch('/news-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ termo: termo })
      });
      const result = await response.json();
      if (result.length < 1) {
        throw new Error('Nenhum resultado encontrado.');
      }
      return result;
    } catch (error) {
      this.setState({ searchError: error.message });
      return [];
    }
  }

  getRenderNoticias = () => {
    const { noticias, searchTerm } = this.state;
    const noticiasFiltradas = noticias.filter(noticia => noticia.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return searchTerm.length > 0 ? noticiasFiltradas : noticias;
  }

  componentDidMount = async () => {
    try {
      const response = await fetch('/posts');
      const noticias = await response.json();
      this.setState({ noticias: noticias });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { searchTerm, searchError } = this.state;
    const renderNoticias = this.getRenderNoticias();

    return (
      <section className="posts">
        <div id="buscarNoticias">
          <h2>Notícias</h2>
          <form id="formBusca">
            <label htmlFor="inputTermo">Buscar pelo termo: </label>
            <input
              type="text"
              id="inputTermo"
              autoComplete="off"
              required
              onKeyUp={this.handleSearchTermChange}
            />
            <section className="searchResult">
              {searchTerm.length > 0 &&
                <>
                  {searchError && <p className="pResults">{searchError}</p>}
                  {renderNoticias.map((noticia, index) => (
                    <p key={index} className="pResults">
                      <a className="aResults" href={`#${noticia._id}`}>
                        {noticia.title}
                      </a>
                    </p>
                  ))}
                </>
              }
            </section>
            <input type="submit" value="Buscar" id="buscarTermo" />
          </form>
        </div>
        <div className="divartigos">
          {renderNoticias.map((noticia) => (
            <React.Fragment key={noticia._id}>
              <br />
              <article className="artigos" id={noticia._id}>
                <h2>{noticia.title}</h2>
                <p className="content">{noticia.content}</p>
                <p className="postBy">Publicado em: {noticia.pTime}</p>
              </article>
            </React.Fragment>
          ))}
        </div>
      </section>
    );
  }
}

export default Posts;