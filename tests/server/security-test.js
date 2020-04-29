const request = require('supertest');
const {app} = require('../../src/server/app');

//In this file each endpoint is tested for when it returns 401 and 403 (if applicable, i.e., if they can return such codes)

//To generate unique user name we use counter as shown in lecture
let counter = 0;

//Lets first test players api end points
//Skipping /players get endpoint as it is accessible by everyone

//Testing post -> /api/players/loot
test("Try to buy loot box without logging in", async () => {

    const response = await request(app)
        .post('/api/players/loot');
    expect(response.statusCode).toBe(401);
});

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
    //Second time we expect failure and 403 as we are going to have 0 geons and one loot box is 200
    const response = await agent
        .post('/api/players/loot');
    expect(response.statusCode).toEqual(201);
    //Buy second
    const secondResponse = await agent
        .post('/api/players/loot');
    expect(secondResponse.statusCode).toEqual(403);
});

//Testing /api/players/loot -> put
//Although at the moment not used as endpoint in front end we might use it in future
//That is why we are goint to test it
test("Try to re roll box without login", async () => {
    const response = await request(app)
        .put('/api/players/loot');
    expect(response.statusCode).toBe(401);
});
//We create user, user has 3 loot boxes by default we use those and try again to open fourth
//This should fail with 403
test("Try to re roll box when you have no more boxes", async () => {
        const agent = request.agent(app);

        const signup = await agent
            .post("/api/signup")
            .send({userId: "foo_" + counter, password: "foo_" + counter})
            .set('Content-Type', 'application/json');
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

        //Now we should get 403 if we try to re roll without having loot boxes
        response = await agent
            .put("/api/players/loot");
        expect(response.statusCode).toEqual(403)
    }
);

//Testing user api
