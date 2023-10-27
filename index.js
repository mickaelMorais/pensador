const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const app = express();
const conn = require('./db/conn');

// import Models
const User = require('./models/User');
const Thoughts = require('./models/Thoughts');

// Import rotas
const thoughtsRoutes = require('./routes/thoughtsRouters');
const authRoutes = require('./routes/authRouters');

// Import Controller
const ThoughtsController = require('./controllers/ThoughtsController')

// Configurar engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Configurar JSON
app.use(express.urlencoded({ extended:true }));
app.use(express.json());

// Middleware para as sessões
app.use(session({
	name: 'session',
	secret: 'nosso_secret', // Quanto maior a crypto melhor
	resave: false,
	saveUninitialized: false,
	store: new FileStore({
		logFn: function (){

		},
		path: require('path').join(require('os').tmpdir(), 'sessions')
	}),
	cookie: {
		secure: false,
		maxAge: 360000,
		expixes: new Date(Date.now() + 360000),
		httpOnly: true
	}
}));

// Import as flash
app.use(flash());

// Import arquivos estáticos
app.use(express.static('public'));

// Armazenar as sessões nas rotas
app.use((req, res, next) => {
	if(req.session.userId){
		res.locals.session = req.session
	};
	next();
});

// Rotas

app.use('/thoughts', thoughtsRoutes);
app.use('/', authRoutes);

app.get('/', ThoughtsController.showThoughts)
// app.get('/', authController.login)
// app.get('/', authController.register)

// Conexão e criação das tabelas do banco

conn
	.sync()
	.then(() => {
		app.listen(9999, () => {
			console.log(`http://localhost:9999`);
		});
	})
	.catch((err) => console.log(err));
