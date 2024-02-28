const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carPartsCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  subcategories: [{
    type: Schema.Types.ObjectId,
    ref: 'CarPartsCategory'
  }],
  parts: [{
    type: Schema.Types.ObjectId,
    ref: 'CarPart'
  }]
});

module.exports = mongoose.model('CarPartsCategory', carPartsCategorySchema);
