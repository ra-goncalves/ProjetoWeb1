import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from "./Login";
import Home from './Home';
import Cadastro from './Cadastro';
import Tarefa from './Tarefa';
import WS from './WS';
import Redis from './Redis';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<Login />}></Route>
                    <Route path='/home' element={<Home />}></Route>
                    <Route path='/users' element={<Cadastro />}></Route>
                    <Route path='/tasks' element={<Tarefa />}></Route>
                    <Route path='/websocket' element={<WS />}></Route>
                    <Route path='/redis' element={<Redis />}></Route>
                </Routes>
            </BrowserRouter>
        )
    }

}

export default App;