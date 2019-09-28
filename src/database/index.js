import _React from 'react';
import SQLite from 'react-native-sqlite-storage';
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';

import axios from 'axios';

import { tableUser } from './tables';

const DB = SQLite.openDatabase('rioDoCampoLimpo.db');

const setDatabase = async callback => {
	try {
		await query(tableUser);

		callback();
	} catch (error) {
		console.log('Database Error', error);
		callback(false);
	}
};

const dropDatabase = () => {
	SQLite.dropDatabase('rioDoCampoLimpo.db');
};

const transaction = async () => {
	return new Promise(resolve => {
		DB.transaction(txn => {
			resolve(txn);
		});
	});
};

const query = async (sql, args = []) => {
	return new Promise((resolve, reject) => {
		transaction().then(txn => {
			txn.executeSql(sql, args, (n_txn, result) => {
        resolve(result);
      }, err => {
        reject(err);
      });
		});
	});
};

const login = (phone, password, callback) => {
  axios.post('https://rio-campo-limpo.herokuapp.com/api/users/login', { phone, password }).then(resUser => {
    const user = resUser.data.user;
    const token = resUser.data.token;

    DB.transaction(txn => {
      txn.executeSql('INSERT INTO user (id, phone, cpf, name, image, token) VALUES (?, ?, ?, ?, ?, ?)', [
        user._id, user.phone, user.cpf, user.name, user.image, token
      ], (tx, res) => {
        callback();
      }, err => {
        callback(err);
      });
    });
  }).catch(error => {
    callback(error);
  });
};

const facebookLogin = (navigation, callback) => {
	LoginManager.logInWithPermissions(['email', 'public_profile']).then(result => {
    if(result.isCanceled) {
      // Alert.alert('login cancelado!');
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        console.log('facebooookkk', data);

        const infoRequest = new GraphRequest('/me?fields = email, picture, name', null, (err, user) => {
          if(err) {
            console.log('error: ' + err);
          } else {
            console.log('success: ');
            console.log(user);
            axios.get('https://rio-campo-limpo.herokuapp.com/api/users/').then(res => {
              console.log('ooooo', res.data);
            });
            // verificaEmail(user.email, user.name, null, user.id, callback, () => {
            //   navigation.navigate('miniCadastro', {
            //     nome: user.name,
            //     googleId: null,
            //     email: user.email,
            //     facebookId: user.id,
            //   });
            // });
          }
        });

        new GraphRequestManager().addRequest(infoRequest).start();
      });
    }
  }, error => {
    console.log('eerrr', error);
    // Alert.alert('Falha ao efetuar o login');
  }).catch(err => {
    console.log(err);
  });
};

const updateUserLocal = (id, phone, cpf, name, image, callback) => {
	DB.transaction(txn => {
		txn.executeSql('UPDATE user SET name = ?, cpf = ?, phone = ?, image = ? WHERE id = ?', [name, cpf, phone, image, id], (_txn, res) => {
      callback(res);
    });
	});
};

const logout = callback => {
	query('DELETE FROM user WHERE phone != 0').then(_res => {
    callback();
  }).catch(err => console.log('logout', err));
};

export default DB;

module.exports = { transaction, query, setDatabase,	dropDatabase, updateUserLocal, login, facebookLogin, logout };