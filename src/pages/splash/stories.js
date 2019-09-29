import { query, setDatabase, dropDatabase } from '../../database';

const SQL_check_table = `SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'user'`;
const SQL_get_user = 'SELECT * FROM user';

const checkUser = async () => {
	try {
		const resCheckTable = await query(SQL_check_table);

		if(!resCheckTable.rows.length) {
			setDatabase((result = true) => {
				if(!result) {
					dropDatabase();
				}
			});
		}
	} catch(error) {
		console.log('ERROR', error);
	}
};

module.exports = { checkUser };