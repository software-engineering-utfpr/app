const tableUser = 'CREATE TABLE IF NOT EXISTS user(' +
	'id VARCHAR(30),' +
	'phone VARCHAR(15),' +
	'cpf VARCHAR(14),' +
	'name VARCHAR(100),' +
	'token VARCHAR(150)' +
');';

module.exports = { tableUser };