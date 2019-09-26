import { query, setDatabase, dropDatabase } from '../../database';

const SQL_check_table = `SELECT name FROM sqlite_master WHERE type='table' AND name = 'tableUser'`;
const SQL_get_user = 'SELECT * FROM tableUser';

const checkUser = async callback => {
	try {
		const resCheckTable = await query(SQL_check_table);

		if(!resCheckTable.rows.length) {
			setDatabase((result = true) => {
				if(!result) {
					dropDatabase();
				}
				return callback(false);
			});
		} else {
			const userRes = await query(SQL_get_user);
			return userRes.rows.length ? callback(true) : callback(false);
		}
	} catch(error) {
		callback(false);
	}
};

module.exports = { checkUser };