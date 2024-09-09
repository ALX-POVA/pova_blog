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
            const userData = {
                firstName: "Pius",
                lastName: "Aaron",
                email: "piuschbz@gmail.com",
                password: "Let'd go",
                username: "piusaaron"
            }

            const userId = await addUser(userData);
            expect(userId).to.be.a('string');

            const userData2 = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@yahoo.com",
                username: "johnDoe",
                password: "helooowbufu"
            }

            expect(await addUser(userData2)).to.be.a('string');
        });

        it("Should error on creating user with Invalid data", async function (){
            const user = {
                firstName: "Jane",
                lastName: "Clien",
                username: "janajane",
                password: "hiewriisw"
            }

            expect.apply(await addUser(user)).to.throw(new Error());
            
        })
    });

    describe("getUser()", function(){
        it("Should gets an existing user", async function () {
            const user = await getUser({email: "piuschbz@gmail.com"});

            expect(user).to.be.an('object');
            expect(user).not.to.include.keys('password');
            expect(user).to.have.any.keys('_id');
        });
    });

    describe("deleteUser()", function(){
        it("Should delete a user", async function(){
            const user = await getUser({email: "piuschbz@gmail.com"});
            expect(await deleteUser(user._id)).to.be.a('string');
            expect(await getUser({email: "piuschbz@gamil.com"})).to.be.null;
        });
    })
});

