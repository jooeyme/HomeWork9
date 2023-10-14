const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var pool = require("../query.js");

const secretkey = "key";

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`;
        const result = await pool.query(query, [email, hashedPassword]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering new user. Please try again.');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0) {
            return res.status(404).send('User not found.');
        }

        const users = rows[0];
        if (await bcrypt.compare(password, users?.password)) {
            const token = jwt.sign({ email: users?.email }, secretkey);
            return res.json({ token });
        } else {
            return res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretkey, (err, users) => {
        if (err) return res.sendStatus(403);
        req.users = users;
        next();
    });
};

module.exports = { register, login, authenticateToken };
