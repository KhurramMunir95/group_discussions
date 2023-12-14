import mongoose from "mongoose";

const { Schema, model } = mongoose

const groupSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Users'
        }
    }, 
    {
        timestamps: true
    }
)

const Group = model('Groups', groupSchema);
export default Group;