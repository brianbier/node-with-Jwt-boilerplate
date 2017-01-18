module.exports = {
  //Secret key for Json web token (jwt) and encryption
  'secret': 'super secret passphrase',
  //Database connection information
  'database': 'mongodb://test:test@ds149577.mlab.com:49577/mern-justsearch-app',
  //Setting up the port for the server
  'port': process.env.PORT || 3000
}