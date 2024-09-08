// tests/models/user.test.js
import { expect } from 'chai';
import { addUser, getUser, deleteUser } from '../../models/user.js';
import { connectDB, client, db} from '../../config/db.js';

describe("User Model", function () {
    before(async function(){
        await connectDB();
    });

    after(async function(){
        await db.collection("Users").deleteMany({});
        await client.close();
    });

    describe("addUser()", function(){
        it("Should add a valid user and return userId", async function (){
            const userId = addUser({});
            expect(userId).to.be.a('string');
        })
    })
})

