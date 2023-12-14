import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        username:
        {
            type: String,
        },
        email :
        {
            type: String,
            unique: true
        },
        password:
        {
            type: String,
        },
        profileImage: 
        {
            type: String,
        },
        role: {
            type: String
        }
    },
    {
        timestamps : true
    }
)

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
})

userSchema.methods.matchPassword = async function(enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password)
}

const User = model('Users', userSchema)

export default User