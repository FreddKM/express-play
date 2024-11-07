const { Pool } = require('pg');

const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	// password: process.env.PGDATABASE,
	port: process.env.PGPORT || 5432,
});

exports.pool = pool;
