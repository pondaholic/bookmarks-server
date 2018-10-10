const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
	url: { type: String, required: true },
	name: { type: String, required: true },
	description: { type: String, date: Date },
	rating: { type: Number, required: true }
});

bookmarkSchema.methods.serialize = function() {
	return {
		id: this._id,
		url: this.url,
		name: this.name,
		description: this.description,
		rating: this.rating
	};
};

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = { Bookmark };
