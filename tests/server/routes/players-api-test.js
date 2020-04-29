const request = require('supertest');
const {app} = require('../../../src/server/app');

//To generate unique user name we use counter as shown in lecture
let counter = 0;

test("Try to buy loot box with insufficient funds", async () => {
    const agent = request.agent(app);

    const signup = await agent
        .post("/api/signup")
        .send({userId: "foo_" + counter, password: "foo_" + counter})
        .set('Content-Type', 'application/json');
    expect(signup.statusCode).toBe(201);
    counter++;
    //As each player has enough funds to buy first loot box we shall buy it twice
    //First time we expect success, and 201
    //Second time we expect failure and 404 as we are going to have 0 geons and one loot box is 200
    const response = await agent
        .post('/api/players/loot');
    expect(response.statusCode).toEqual(201);
    //Buy second
    const secondResponse = await agent
        .post('/api/players/loot');
    expect(secondResponse.statusCode).toEqual(404);
});

//We create user, user has 3 loot boxes by default we use those and try again to open fourth
//This should fail with 404
test("Try to re roll box when you have no more boxes", async () => {
        const agent = request.agent(app);

        const signup = await agent
            .post("/api/signup")
            .send({userId: "foo_" + counter, password: "foo_" + counter})
            .set('Content-Type', 'application/json');
        counter ++;
        expect(signup.statusCode).toBe(201);

        //First open boxes we own
        let response = await agent
            .post('/api/user/loot');
        expect(response.statusCode).toEqual(201);
        response = await agent
            .post('/api/user/loot');
        expect(response.statusCode).toEqual(201);
        response = await agent
            .post('/api/user/loot');
        expect(response.statusCode).toEqual(201);

        //Now we should get 404 if we try to re roll without having loot boxes
        response = await agent
            .put("/api/players/loot");
        expect(response.statusCode).toEqual(404)
    }
);
