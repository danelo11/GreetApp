const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    nick: {type: String, required: true},
    content: {type: String, required: true},
    type: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now}
})

module.exports = mongoose.model('mensajes', MessageSchema);