import users from "../../../src/server/db/users";
import {getLootSet} from "../../../src/server/db/players-collection";

test("Test if loot box is rerolled", () =>{
    let id = "admin";
    users.createUser(id,"admin");
    const isRerolled =users.reRollLootSet(id,getLootSet());
    expect(isRerolled).toBe(true);
});