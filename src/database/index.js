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
	} catch(error) {
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
      txn.executeSql('INSERT INTO user (id, phone, cpf, name, image, token, facebookID) VALUES (?, ?, ?, ?, ?, ?, null)', [
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

const facebookLogin = (navigation, setLoadingPage, callback) => {
	LoginManager.logInWithPermissions(['email', 'public_profile']).then(result => {
    if(result.isCanceled) callback('Operação Cancelada.');
    else {
      AccessToken.getCurrentAccessToken().then(data => {
        const infoRequest = new GraphRequest('/me?fields = id, email, name, phone, picture.type(large)', null, (err, facebookUser) => {
          if(err) {
            callback('Requisão ao Facebook Negada.');
          } else {
            axios.get('https://rio-campo-limpo.herokuapp.com/api/users').then(res => {
              const user = res.data[res.data.map(e => e.facebookID).indexOf(facebookUser.id)];

              if(user) {
                axios.post('https://rio-campo-limpo.herokuapp.com/api/users/loginFacebook', { id: user._id }).then(resUser => {
                  const token = resUser.data.token;

                  DB.transaction(txn => {
                    txn.executeSql('INSERT INTO user (id, phone, cpf, name, image, token, facebookID) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                      user._id, user.phone, user.cpf, user.name, user.image, token, facebookUser.id
                    ], (tx, res) => {
                      callback();
                    }, err => {
                      callback('Não foi possível acessar o Servidor.');
                    });
                  });
                });
              } else {
                setLoadingPage(false);
                navigation.navigate('MinimalSignup', {
                  name: facebookUser.name,
                  facebookId: facebookUser.id
                });
              }
            });
          }
        });

        new GraphRequestManager().addRequest(infoRequest).start();
      });
    }
  }, error => {
    callback('Erros com Permissões do Facebook.');
  }).catch(err => {
    callback('Erro Desconehcido, tente novamente mais tarde.');
  });
};

const linkWithFacebook = (id, callback) => {
	axios.post('https://rio-campo-limpo.herokuapp.com/api/users/loginFacebook', { id }).then(resUser => {
    const token = resUser.data.token;
    const user = resUser.data.user;

    DB.transaction(txn => {
      txn.executeSql('INSERT INTO user (id, phone, cpf, name, image, token, facebookID) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        user._id, user.phone, user.cpf, user.name, user.image, token, user.facebookID
      ], (tx, res) => {
        callback();
      }, err => {
        callback('Não foi possível acessar o Servidor.');
      });
    });
  }).catch(err => {
    callback('Não foi possível acessar o Servidor.')
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
    facebookLogOut();
    callback();
  }).catch(err => console.log('logout', err));
};

const facebookLogOut = async () => {
	await LoginManager.logOut();
};

export default DB;

module.exports = { transaction, query, setDatabase,	dropDatabase, updateUserLocal, login, facebookLogin, linkWithFacebook, logout };