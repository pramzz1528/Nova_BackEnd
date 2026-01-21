const mongoose = require('mongoose');

const uri = "mongodb+srv://pramodkmadhavan46_db_user:pramod1123@novacluster.1iy3gtl.mongodb.net/nova?appName=Novacluster";

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Connected.");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const User = require('./models/User');
        const count = await User.countDocuments();
        console.log("User count via Mongoose:", count);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
run();
