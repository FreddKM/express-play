const { pool: db } = require('../db/config');

exports.goHome = (req, res) => {
	res.send('Hello World!');
};

exports.listUsers = async (req, res) => {
	const ops = {
		gt: '>',
		gte: '=>',
		lt: '<',
		lte: '=<',
		equal: '=',
	};

	const getAllUsers = async () => {
		const query = `SELECT * FROM users ORDER BY created_at DESC`;

		try {
			const result = await db.query(query);
			return result.rows;
		} catch (error) {
			throw new Error(`Error fetching users: ${error.message}`);
		}
	};

	const users = await getAllUsers();

	res.send(users);
};

exports.getUser = async (req, res) => {
	console.log('WE ARE IN', req.params.id);
	const getOneUser = async (id) => {
		const query = 'SELECT * FROM users WHERE id = $1';

		try {
			const result = await db.query(query, [parseInt(req.params.id)]);
			return result.rows[0];
		} catch (error) {
			throw new Error(`Error fetching user: ${error.message}`);
		}
	};
	res.send(await getOneUser());
};

exports.updateUser = async (req, res) => {
	const updateOne = async (id) => {
		// const allowedFields = ['username', 'email'];
		const updates = [];
		const values = [];
		let paramCount = 1;

		// Build dynamic update query based on provided fields
		Object.keys(req.body).forEach((field) => {
			updates.push(`${field} = $${paramCount}`);
			values.push(req.body[field]);
			paramCount++;
		});

		values.push(parseInt(req.params.id));

		if (updates.length === 0) {
			throw new Error('No valid fields to update');
		}

		const query = `UPDATE users SET ${updates.join(
			', '
		)} WHERE id = $${paramCount} RETURNING *`;

		try {
			const result = await db.query(query, values);
			return result.rows[0];
		} catch (error) {
			throw new Error(`Error updating user: ${error.message}`);
		}
	};

	res.send(await updateOne());
};

exports.createUser = async (req, res) => {
	const createUser = async () => {
		const passwordHash = 'password';
		try {
			// Insert user
			const insertQuery = `
                                INSERT INTO users (
                                username,
                                email,
                                password_hash
                                )
                                VALUES ($1, $2, $3)
                                RETURNING *
                            `;

			const result = await db.query(insertQuery, [
				req.body.username,
				req.body.email.toLowerCase(),
				// req.body.authorId,
				passwordHash,
			]);

			// // Create default user settings (optional)
			// await this.createUserSettings(client, result.rows[0].id);

			// Commit transaction
			await db.query('COMMIT');

			return result.rows[0];
		} catch (error) {
			throw new Error(`Error fetching user: ${error.message}`);
		}
	};

	res.send(await createUser());
};

exports.deleteUser = async (req, res) => {
	const deleteUser = async () => {
		const query = 'DELETE FROM users WHERE id = $1 RETURNING *';

		try {
			const result = await db.query(query, [parseInt(req.params.id)]);
			return result.rows;
		} catch (error) {
			throw new Error(`Error delete user: ${error.message}`);
		}
	};
	res.send(await deleteUser());
};
