import mongoose from "mongoose";
const { Schema, model } = mongoose;


const postSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true, 
            ref: 'Users'
        },
        group: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Groups'
        },
        post: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Post = model('Posts', postSchema);

export default Post;