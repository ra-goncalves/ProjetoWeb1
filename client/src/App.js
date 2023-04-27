import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from "./Login";
import Cadastro from "./Cadastro";

import Home from './Home';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/logar' element={<Login />}></Route>
                    <Route path='/cadastrar_user' element={<Cadastro />}></Route>
                </Routes>
            </BrowserRouter>
        )
    }

}

export default App;