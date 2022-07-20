
// const { populateDb } = require('./src/helpers/helpers');
const server = require('./src/app.js');
const { conn } = require('./src/db.js');


conn.sync({ force: true }).then(() => {
  server.listen(3001, async () => {
    // populateDb()
    console.log('%s We shillin');
  });
});
