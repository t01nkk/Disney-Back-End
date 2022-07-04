
const { loadDb } = require('./src/Middlewares/middleware');
const server = require('./src/app.js');
const { conn } = require('./src/db.js');


conn.sync({ force: true }).then(() => {
  server.listen(3001, async () => {
    console.log('%s We shillin');
  });
});
