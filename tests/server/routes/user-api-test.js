const request = require('supertest');
const {app} = require('../../../src/server/app');

test("Try to open loot box when you have no more", async () => {
    const agent = request.agent(app);

    const signup = await agent
        .post("/api/signup")
        .send({userId: "admin", password: "admin"})
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);
    //Each use has 3 loot boxes up on registration
    //Lets open them all
    let response = await agent
        .post('/api/user/loot');
    expect(response.statusCode).toEqual(201);

    response = await agent
        .post('/api/user/loot');
    expect(response.statusCode).toEqual(201);

    response = await agent
        .post('/api/user/loot');
    expect(response.statusCode).toEqual(201);

    //Lets try to open fourth, which we do not poses
    response = await agent
        .post('/api/user/loot');
    expect(response.statusCode).toEqual(404);
});