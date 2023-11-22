import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: { type: "String", required: true },
        email: { type: "String", unique: true, required: true },
        password: { type: "String", required: true },
    },
    { timestaps: true }
);

userSchema.methods.matchPassword = function (enterdPassword) {
    console.log('------------------------------------------');
    console.log(this.password);
    console.log(enterdPassword);
    console.log('------------------------------------------');
}

const User = mongoose.model("User", userSchema);

export default User;