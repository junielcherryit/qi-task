"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const promise_1 = __importDefault(require("mysql2/promise"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const getQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let connection = null;
    try {
        connection = yield promise_1.default.createConnection({
            host: 'db',
            user: 'userQi',
            password: 'passwordQi',
            database: 'qi',
        });
        const result = yield connection.execute(query);
        return result;
    }
    catch (e) {
        console.log({ e });
        return undefined;
    }
    finally {
        connection === null || connection === void 0 ? void 0 : connection.end();
    }
});
app.get('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield getQuery('SELECT * FROM Tasks');
        console.log({ rows });
        res.status(200).json(rows);
    }
    catch (e) {
        console.log({ e });
        res.status(500).send('Internal server error');
    }
}));
app.get('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const result = yield getQuery(`SELECT * FROM Tasks WHERE id = ${id}`);
        console.log({ result });
        res.status(200).json(((_a = result[0]) === null || _a === void 0 ? void 0 : _a.rows) || []);
    }
    catch (e) {
        console.log({ e });
        res.status(500).send('Internal server error');
    }
}));
app.post('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { description } = req.body;
        const result = yield getQuery(`INSERT INTO Tasks (description) VALUES ('${description}')`);
        console.log({ result });
        res.status(201).json(((_b = result[0]) === null || _b === void 0 ? void 0 : _b.rows) || []);
    }
    catch (e) {
        console.log({ e });
        res.status(500).send('Internal server error');
    }
}));
app.put('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bodyLenght = Object.keys(req.body).length;
        if (bodyLenght === 0) {
            return res.status(400).send('Campo de descrição ou status da tarefa são obrigatórios');
        }
        let query = 'UPDATE Tasks SET ';
        Object.entries(req.body).forEach(([key, value], index) => {
            query += `${key} = '${value}'`;
            if (index !== bodyLenght - 1) {
                query += ', ';
            }
        });
        query += ` WHERE id = ${id}`;
        const result = yield getQuery(query);
        console.log({ result });
        res.status(200).json(result[0] || {});
    }
    catch (e) {
        console.log({ e });
        res.status(500).send('Internal server error');
    }
}));
app.delete('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield getQuery(`DELETE from Tasks WHERE id = ${id}`);
        console.log({ result });
        res.status(200).json(result[0] || {});
    }
    catch (e) {
        console.log({ e });
        res.status(500).send('Internal server error');
    }
}));
app.listen(8000, () => {
    console.log('Server started!');
});
