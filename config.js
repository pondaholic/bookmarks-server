exports.DATABASE_URL =
	process.env.DATABASE_URL || 'mongodb://localhost/bookmarks-app';
exports.TEST_DATABASE_URL =
	process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-bookmarks-app';
exports.PORT = process.env.PORT || 8080;
