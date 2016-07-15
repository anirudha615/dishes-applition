    var mongoose = require ('mongoose');
    var Schema = mongoose.Schema;
    require('mongoose-currency').loadType(mongoose);
    var Currency = mongoose.Types.Currency;
    
    var comment = new Schema({
        rating:{type: Number, min:1, max:5, required: true},
        comment:{type: String, required: true},
        author:{type: String, required: true}},
        {timestamps: true});
    
    var dish = new Schema({
        name: {type: String, required: true, unique: false},
        description: {type: String, required: true },
        category: {type: String, required: true},
        label: {type: String, required: true},
        image: {type: String, required: true},
        comments: [comment]},
        {timestamps: true});
            
    var dish1 = mongoose.model('pen',dish);
    
    module.exports = dish1;