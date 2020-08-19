const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InputSchema = new Schema ({
    waterVolume: {
        type: String
    },
    waterDate: {
        type: Date
    },
    plantDate: {
        type: Date
    },
    amendmentDate: {
        type: Date
    },
    temperature: {
        type: Number
    },
    havestDate: {
        type: Date
    }
})