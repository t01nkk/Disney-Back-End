/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Character, conn } = require('../../src/db.js');

const agent = session(app);
const character = {
    name: 'Pocahontas',
};

describe('Character routes', () => {
    before(() => conn.authenticate()
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        }));
    beforeEach(() => Character.sync({ force: true })
        .then(() => Character.create(pokemon)));
    describe('GET /characters', () => {
        it('should get 200', () =>
            agent.get('/characters').expect(200)
        );
    });
});