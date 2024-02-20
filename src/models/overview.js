// models/CarModel.js
import mongoose from 'mongoose';

const overviewSchema = new mongoose.Schema({
        coverImage: {
            type: String,
            required: true,
        },
        title: { 
            type: String,
            required: true,
        },
        description: { 
            type: String,
            required: true,
        },
        images:[{
            type: String,
            required: true,
        }],
}, { timestamps: true})
const Overview = mongoose.models.Overview || mongoose.model('Overview', overviewSchema);

export default Overview;
