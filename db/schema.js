const db = require('./config');

async function createSchema() {
	const client = await db.connect();

	try {
		// Start transaction
		await client.query('BEGIN');

		// Create users table
		await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

		// Create posts table
		await client.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

		// Create comments table
		await client.query(`
        CREATE TABLE IF NOT EXISTS comments (
          id SERIAL PRIMARY KEY,
          post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

		// 	// Create trigger function to update timestamps
		// 	await client.query(`
		//     CREATE OR REPLACE FUNCTION update_updated_at_column()
		//     RETURNS TRIGGER AS $$
		//     BEGIN
		//       NEW.updated_at = CURRENT_TIMESTAMP;
		//       RETURN NEW;
		//     END;
		//     $$ language 'plpgsql';
		//   `);

		// 	// Create triggers for each table
		// 	await client.query(`
		//     CREATE TRIGGER update_users_modtime
		//       BEFORE UPDATE ON users
		//       FOR EACH ROW
		//       EXECUTE FUNCTION update_updated_at_column();
		//   `);

		// 	await client.query(`
		//     CREATE TRIGGER update_posts_modtime
		//       BEFORE UPDATE ON posts
		//       FOR EACH ROW
		//       EXECUTE FUNCTION update_updated_at_column();
		//   `);

		// 	await client.query(`
		//     CREATE TRIGGER update_comments_modtime
		//       BEFORE UPDATE ON comments
		//       FOR EACH ROW
		//       EXECUTE FUNCTION update_updated_at_column();
		//   `);

		// Commit transaction
		await client.query('COMMIT');

		console.log('Schema created successfully');
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}

createSchema();
