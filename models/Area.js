const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AreaSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
})

module.exports = Area = mongoose.model('areas', AreaSchema)