"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./database"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.post('/api/auth/register', (req, res) => {
    const { username, emailId, password } = req.body;
    if (!username || !emailId || !password) {
        return res.status(400).json({ message: 'Username, emailId and password are required.' });
    }
    const existingUser = database_1.default
        .prepare('SELECT * FROM users WHERE emailId = ?')
        .get(emailId);
    if (existingUser) {
        return res.status(409).json({ message: 'User already registered. Please login.' });
    }
    try {
        const insert = database_1.default.prepare('INSERT INTO users (username, emailId, password) VALUES (?, ?, ?)');
        const result = insert.run(username, emailId, password);
        const createdUser = database_1.default
            .prepare('SELECT id, username, emailId FROM users WHERE id = ?')
            .get(result.lastInsertRowid);
        return res.status(201).json({
            message: 'User registered successfully',
            user: createdUser,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to register user at the moment.' });
    }
});
app.post('/api/auth/login', (req, res) => {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = database_1.default
        .prepare('SELECT * FROM users WHERE emailId = ?')
        .get(emailId);
    if (!user) {
        return res.status(404).json({
            message: 'User is not registered. Please register first.',
        });
    }
    if (user.password !== password) {
        return res.status(401).json({
            message: 'Incorrect password. Please try again.',
        });
    }
    return res.status(200).json({
        message: 'Login successful',
        user: {
            id: user.id,
            username: user.username,
            emailId: user.emailId,
        },
    });
});
app.get('/api/users', (_req, res) => {
    const users = database_1.default.prepare('SELECT * FROM users ORDER BY id DESC').all();
    res.status(200).json(users);
});
app.post('/api/users', (req, res) => {
    const { username, emailId, password } = req.body;
    if (!username || !emailId || !password) {
        return res.status(400).json({ message: 'Username, emailId and password are required.' });
    }
    try {
        const insert = database_1.default.prepare('INSERT INTO users (username, emailId, password) VALUES (?, ?, ?)');
        const result = insert.run(username, emailId, password);
        const createdUser = database_1.default
            .prepare('SELECT * FROM users WHERE id = ?')
            .get(result.lastInsertRowid);
        return res.status(201).json(createdUser);
    }
    catch (error) {
        return res.status(409).json({ message: 'User already exists or invalid data.' });
    }
});
app.get('/api/users/email/:keyword', (req, res) => {
    const keyword = String(req.params.keyword ?? '').toLowerCase();
    const users = database_1.default
        .prepare('SELECT * FROM users WHERE LOWER(emailId) LIKE ? ORDER BY id DESC')
        .all(`%${keyword}%`);
    res.status(200).json(users);
});
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const user = database_1.default.prepare('SELECT * FROM users WHERE id = ?').get(Number(id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
});
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, emailId, password } = req.body;
    const existingUser = database_1.default
        .prepare('SELECT * FROM users WHERE id = ?')
        .get(Number(id));
    if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    const updatedUsername = username ?? existingUser.username;
    const updatedEmailId = emailId ?? existingUser.emailId;
    const updatedPassword = password ?? existingUser.password;
    const result = database_1.default.prepare('UPDATE users SET username = ?, emailId = ?, password = ? WHERE id = ?').run(updatedUsername, updatedEmailId, updatedPassword, Number(id));
    if (result.changes === 0) {
        return res.status(400).json({ message: 'User could not be updated' });
    }
    const updatedUser = database_1.default.prepare('SELECT * FROM users WHERE id = ?').get(Number(id));
    return res.status(200).json(updatedUser);
});
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const result = database_1.default.prepare('DELETE FROM users WHERE id = ?').run(Number(id));
    if (result.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
});
