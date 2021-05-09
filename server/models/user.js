import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    token: {type: String},
    refreshToken: {type: String}
});

export default mongoose.model("User", userSchema);
