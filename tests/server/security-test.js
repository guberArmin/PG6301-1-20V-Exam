const request = require('supertest');
const {app} = require('../../src/server/app');

//In this file each endpoint is tested for when it returns 401 and 403 (if applicable, i.e., if they can return such codes)

//To generate unique user name we use counter as shown in lecture
let counter = 0;

//Lets first test players api end points
//Skipping /players get endpoint, as it is accessible by everyone

//Testing post -> /api/players/loot
test("Try to buy loot box without logging in", async () => {

    const response = await request(app)
        .post('/api/players/loot');
    expect(response.statusCode).toBe(401);
});

//Testing /api/players/loot -> put
//Although at the moment not used as endpoint in front end we might use it in future
//That is why we are goint to test it
test("Try to re roll box without login", async () => {
    const response = await request(app)
        .put('/api/players/loot');
    expect(response.statusCode).toBe(401);
});

//Testing user api

//post -> /api/login

test("Test login with non existing user", async () => {

    const response = await request(app)
        .post("/api/login")
        .send({userId: "foo_" + counter, password: "foo_" + counter})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toEqual(401);

});

//

//post -> /api/signup and post -> /api/logout  -> endpoints I am skipping because they do not return 401 or 403

//get -> /api/user
test("Test getting user data when not logged in", async () => {
    const response = await request(app).get("/api/user");
    expect(response.statusCode).toEqual(401);
});

//get -> /api/user/players
test("Test getting all players that player owns without logging in", async () => {
    const response = await request(app).get("/api/user/players");
    expect(response.statusCode).toEqual(401);
});

//delete -> /user/players/:id

test("Try to delete/sell without login", async () => {
    const response = await request(app).delete("/api/user/players/1");
    expect(response.statusCode).toEqual(401);
});

//get -> /user/loot

test("Try to get all loot boxes owned by user without login", async () => {
    const response = await request(app).get("/api/user/loot");
    expect(response.statusCode).toEqual(401);
});

//post -> /user/loot

test("Try to open loot without logging in", async () => {
    const response = await request(app).post("/api/user/loot");
    expect(response.statusCode).toEqual(401);
});

//post -> /wstoken

test("Try to create ws token without logging in", async () =>{
    const response = await request(app).post("/api/wstoken");
    expect(response.statusCode).toEqual(401);
});