import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from "./Login";
import Home from './Home';
import Cadastro from './Cadastro';
import Tarefa from './Tarefa';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<Login />}></Route>
                    <Route path='/home' element={<Home />}></Route>
                    <Route path='/cadastro' element={<Cadastro />}></Route>
                    <Route path='/tarefa' element={<Tarefa />}></Route>
                </Routes>
            </BrowserRouter>
        )
    }

}

export default App;