import http from 'http';
import { config } from 'dotenv';
import { json, IncomingMessageWithBody } from './middlewares/json';
import { Users, User } from './routes/routes';
import url from 'url';

config();
const port = process.env.PORT || 3000;
const users = new Users();

const server = http.createServer(
	async (req: IncomingMessageWithBody<any>, res) => {
		await json<User>(req, res);
		if (req.method === 'GET' && req.url === '/users') {
			users.list(req, res);
		}

		if (req.method === 'POST' && req.url === '/users') {
			const { name, password } = req.body;
			const user = { name, password };
			users.create(user);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end('user added');
		}
		if (req.method === 'PUT') {
			const parsedUrl = url.parse(req.url!, true).pathname;
			const userTofindIndex = Number(parsedUrl!.replace(/\D/g, ''));

			if (!userTofindIndex) {
				res.writeHead(404);

				res.end({ message: 'Bad request' });
			} else {
				let body = '';
				req.on('data', (chunk) => {
					body += chunk.toString();
				});
				req.on('end', () => {
					const newUserData = JSON.parse(body);
					users.edit(userTofindIndex, newUserData);
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end('user edited');
				});
			}
		}
	}
);

server.listen(port, () => {
	console.log(`listen on ${port}`);
});
