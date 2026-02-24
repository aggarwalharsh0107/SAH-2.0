<<<<<<< HEAD

=======
>>>>>>> 93338859cdb177e485cfbbc1316a429cfd631e4b
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    profileImage: String
});

<<<<<<< HEAD
module.exports = mongoose.model("User", userSchema);
=======
module.exports = mongoose.model("User", userSchema);
>>>>>>> 93338859cdb177e485cfbbc1316a429cfd631e4b
