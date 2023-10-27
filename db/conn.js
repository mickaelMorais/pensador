const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('thought', 'aluno_medio', '@lunoSenai23.', {
	host: '127.0.0.1',
	port: 3306,
	dialect: 'mysql'
});

try{
	sequelize.authenticate()
	console.log('On')
}
catch(err){
	console.log(err)
};

module.exports = sequelize;
