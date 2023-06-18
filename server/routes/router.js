let express = require('express'),
    router = express.Router(),
    Users = require('../models/Users'),
    Noticias = require('../models/Noticias'),
    bodyParser = require('body-parser'),
    upload = require('../models/Uploads'),
    session = require('express-session'),
    amqp = require('amqplib'),
    WebSocket = require('ws')

router.use(session({
    secret: 'supersecretsessionkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
  
  const wss = new WebSocket.Server({ port: 5001 });
  
  let lastMessage = '';
  
  wss.on('connection', (ws) => {
    console.log('Nova conexão WebSocket estabelecida.');
  
    ws.on('message', (message) => {
      console.log('Mensagem recebida do cliente:', message);
  
      if (message !== lastMessage) {
        lastMessage = message;
        console.log('Enviando mensagem de volta para o cliente:', lastMessage);
  
        ws.send(lastMessage);
      }
    });
  
    if (lastMessage) {
      ws.send(lastMessage);
    }
  
    ws.on('close', () => {
      console.log('Conexão WebSocket fechada.');
    });
  });

router.use(bodyParser.json());

router.get('/fila', async (req, res) => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'tarefa';
        await channel.assertQueue(queueName);
        const { messageCount } = await channel.checkQueue(queueName);

        res.json({ queueSize: messageCount });

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Erro ao obter o tamanho da fila:', error);
        res.status(500).json({ error: 'Erro ao obter o tamanho da fila' });
    }
});

router.post('/tarefa', async (req, res) => {
    const task = req.body;

    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'tarefa';

        await channel.assertQueue(queueName);
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(task)));

        console.log('Tarefa enviada para a fila:', task);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Erro ao enviar a tarefa para a fila:', error);
    }

    res.status(200).json({ message: 'Tarefa adicionada à fila do RabbitMQ' });
});

router.get('/', async (req, res) => {
    if (req.session && req.session.login) {
        if (req.session.userTypeAdmin) {
            const noticias = await Noticias.find()
            //console.log(req.session)
            res.render('index', { noticias: noticias, user: req.session.login, username: req.session.username, admin: req.session.userTypeAdmin })
        } else {
            const noticias = await Noticias.find()
            //console.log(req.session)
            res.render('index', { noticias: noticias, user: req.session.login, username: req.session.username })
        }
    } else {
        //console.log('\n -> Requisição de acesso não possui variável de session.login')
        //console.log(req.session)
    }
});

router.post('/cadastrar_user', async (req, res) => {
    const login = req.body.login,
        password = req.body.password,
        username = req.body.username,
        userType = 'normal'

    if (await Users.cadastrar(username, login, password, userType)) {
        console.log('Usuário cadastrado!')
        res.status(200).send()
    } else {
        res.status(403)
        res.end('Falha ao cadastrar.')
    }
})

router.post('/cadastrar_admin', async (req, res) => {
    if (req.session && req.session.login && req.session.userTypeAdmin) {
        const login = req.body.login,
            password = req.body.password,
            username = req.body.username,
            userType = 'admin'
        if (await Users.cadastrar(username, login, password, userType)) {
            console.log('Admin cadastrado!')
            res.redirect('/')
        } else {
            res.end('Falha ao cadastrar.')
        }
    } else {
        res.status(403)
        res.end()
    }
})

router.post('/logar', async (req, res) => {
    const login = req.body.login,
        password = req.body.password

    if (await Users.find(login, password)) {
        req.session.login = login;
        req.session.username = await Users.getUsername(login);
        if (await Users.checkType(login) == 'admin') {
            req.session.userTypeAdmin = true;
        }
        res.status(200).send({ success: true });
    } else {
        console.log('Erro ao logar.');
        res.status(403).end();
    }
});

router.post('/cadastrar_noticia', upload.single('image'), async (req, res) => {
    if (req.file) {
        image = req.file.filename
    } else {
        image = "logo-noticia.png"
    }

    let title = req.body.titulo,
        content = req.body.conteudo

    if (!req.body || title == '' || content == '') {
        res.status(400)
        res.end()
    } else {
        await Noticias.insert(title, content, image)
        res.redirect('/')
    }
})

router.get('/buscar_post', async (req, res) => {
    let termo = req.query.termo
    if (termo == '') {
        console.log('Campo de busca vazio')
        res.status(400).json({ error: 'Campo de busca vazio' })
    }
    const noticias = await Noticias.find(termo)
    res.json(noticias)
})

router.post('/noticiasJSON', async (req, res) => {
    console.log(req.body)
    if (req.session && req.session.login) {
        let termo = req.body.termo
        if (termo == '') {
            console.log('Campo de busca vazio')
            res.status(400)
        }
        const noticias = await Noticias.searchBar(termo)
        res.json(noticias)
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        console.log('Sessão destruída!')
    })
    res.redirect('/')
})

module.exports = router