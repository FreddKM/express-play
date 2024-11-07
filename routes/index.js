files = require('fs').readdirSync(__dirname);
for (i = 0; i < files.length; i++) {
	const file = files[i].replace(/\.[^/.]+$/, '');
	if (file !== 'index') {
		module.exports[file] = require(`./${file}`);
	}
}
