module.exports = (function () {
  return {
    local: { // localhost
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'test',
      database: 'kmulife'
    },
    real: { // real server db info
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    },
    dev: { // dev server db info
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    }
  }
})();
