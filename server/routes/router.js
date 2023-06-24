let express = require('express'),
    router = express.Router(),
    Users = require('../models/Users'),
    Noticias = require('../models/Noticias'),
    bodyParser = require('body-parser'),
    upload = require('../models/Uploads'),
    session = require('express-session'),
    amqp = require('amqplib'),
    WebSocket = require('ws'),
    redisClient = require('../models/Redis'),
    morgan = require('morgan'),
    winston = require('winston'),
    fs = require('fs'),
    expressSanitizer = require('express-sanitizer');

const logDirectory = './logs';
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${logDirectory}/error.log`, level: 'error' }),
        new winston.transports.File({ filename: `${logDirectory}/combined.log` })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

const sessionChecker = (req, res, next) => {
    if (req.session && req.session.login) {
        next();
    } else {
        res.status(403).send('Acesso não autorizado');
    }
};

router.use(expressSanitizer());

router.use(bodyParser.json());

router.use(session({
    secret: 'supersecretsessionkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const morganLogger = morgan('combined', {
    stream: {
        write: function (message) {
            logger.info(message.trim());
        }
    }
});

router.use(morganLogger);

const wss = new WebSocket.Server({ port: 5001 });

let lastMessage = '';

wss.on('connection', (ws) => {
    logger.info('Nova conexão WebSocket estabelecida.');

    ws.on('message', (message) => {
        logger.info('Mensagem recebida do cliente:', message);

        if (message !== lastMessage) {
            lastMessage = message;
            logger.info('Enviando mensagem de volta para o cliente:', lastMessage);

            ws.send(lastMessage);
        }
    });

    if (lastMessage) {
        ws.send(lastMessage);
    }

    ws.on('close', () => {
        logger.info('Conexão WebSocket fechada.');
    });
});

router.use(bodyParser.json());

router.post('/keys', sessionChecker, async (req, res) => {
    const { chave, valor } = req.body;

    try {
        await redisClient.set(chave, valor);
        logger.info('Chave armazenada com sucesso!');
        res.status(200).send('Chave armazenada com sucesso!');
    } catch (error) {
        logger.error('Erro ao armazenar a chave no Redis:', error);
        res.status(500).send('Erro ao armazenar a chave no Redis');
    }
});

router.get('/keys/:keys', sessionChecker, async (req, res) => {
    const { chave } = req.params;

    try {
        const valor = await redisClient.get(chave);

        if (valor) {
            logger.info('Chave encontrada:', valor);
            res.status(200).send(valor);
        } else {
            logger.info('Chave não encontrada!');
            res.status(404).send('Chave não encontrada!');
        }
    } catch (error) {
        logger.error('Erro ao buscar a chave no Redis:', error);
        res.status(500).send('Erro ao buscar a chave no Redis');
    }
});

router.get('/queues', sessionChecker, async (req, res) => {
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
        logger.error('Erro ao obter o tamanho da fila:', error);
        res.status(500).json({ error: 'Erro ao obter o tamanho da fila' });
    }
});

router.post('/tasks', sessionChecker, async (req, res) => {
    const task = req.body;

    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'tarefa';

        await channel.assertQueue(queueName);
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(task)));

        logger.info('Tarefa enviada para a fila:', task);

        await channel.close();
        await connection.close();
    } catch (error) {
        logger.error('Erro ao enviar a tarefa para a fila:', error);
        res.status(500).json({ error: 'Erro ao enviar a tarefa para a fila' });
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
        res.status(403).send('Acesso não autorizado');
    }
});

router.post('/users', async (req, res) => {
    const login = req.sanitize(req.body.login),
        password = req.sanitize(req.body.password),
        username = req.sanitize(req.body.username),
        userType = 'normal';

    if (await Users.cadastrar(username, login, password, userType)) {
        logger.info('Usuário cadastrado!');
        res.status(200).send();
    } else {
        logger.error('Falha ao cadastrar usuário.');
        res.status(400).send('Falha ao cadastrar.');
    }
});

router.post('/admin', sessionChecker, async (req, res) => {
    const login = req.sanitize(req.body.login),
        password = req.sanitize(req.body.password),
        username = req.sanitize(req.body.username),
        userType = 'admin';

    if (await Users.cadastrar(username, login, password, userType)) {
        logger.info('Admin cadastrado!');
        res.redirect('/');
    } else {
        logger.error('Falha ao cadastrar admin.');
        res.status(400).send('Falha ao cadastrar.');
    }
});

router.post('/login', async (req, res) => {
    const login = req.sanitize(req.body.login),
        password = req.sanitize(req.body.password);

    if (await Users.find(login, password)) {
        req.session.login = login;
        req.session.username = await Users.getUsername(login);
        if (await Users.checkType(login) == 'admin') {
            req.session.userTypeAdmin = true;
        }
        logger.info('Usuário logado:', login);
        res.status(200).send({ success: true });
    } else {
        logger.error('Erro ao logar.');
        res.status(403).end();
    }
});

router.post('/news', upload.single('image'), sessionChecker, async (req, res) => {
    if (req.file) {
        image = req.file.filename;
    } else {
        image = "logo-noticia.png";
    }

    let title = req.sanitize(req.body.titulo),
        content = req.sanitize(req.body.conteudo);

    if (!req.body || title == '' || content == '') {
        logger.warn('Campo de busca vazio');
        res.status(400);
        res.end();
    } else {
        await Noticias.insert(title, content, image);
        logger.info('Notícia inserida:', { title, content, image });
        res.redirect('/');
    }
});

router.get('/posts', sessionChecker, async (req, res) => {
    const cacheKey = 'posts';

    try {
        const result = await redisClient.get(cacheKey);

        if (result !== null) {
            const cachedResult = JSON.parse(result);
            logger.info('Resultado da busca de posts (cache):', cachedResult);
            res.json(cachedResult);
        } else {
            const noticias = await Noticias.find();
            logger.info('Resultado da busca de posts:', noticias);

            await redisClient.set(cacheKey, JSON.stringify(noticias));

            res.json(noticias);
        }
    } catch (error) {
        logger.error('Ocorreu um erro ao acessar o cache do Redis:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/news-list', sessionChecker, async (req, res) => {
    logger.info(req.body);
    let termo = req.sanitize(req.body.termo);
    if (termo == '') {
        logger.warn('Campo de busca vazio');
        res.status(400);
    }
    const noticias = await Noticias.searchBar(termo);
    logger.info('Resultado da busca de notícias:', noticias);
    res.json(noticias);
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        logger.info('Sessão destruída!');
    });
    res.redirect('/');
});

module.exports = router;
