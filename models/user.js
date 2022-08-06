var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'No Name'
    },
    photoUrls: []
    
});
module.exports = mongoose.model('User', userSchema);
