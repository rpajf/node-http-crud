import http from 'http';
import { config } from 'dotenv';
import { json, IncomingMessageWithBody } from './middlewares/json';
// import { Entity } from './routes/routes';
import { Entity } from './controllers/entity-controller';
import { IIdGenerator } from './types/entity';
import { IEntityPersistor } from './types/entity';
import { IEntity } from './types/entity';
import url from 'url';

config();
const port = process.env.PORT || 3000;
// const entityPersistor = new EntityPersistor();
const users = new Entity<IEntity>([]);

const server = http.createServer(
	async (req: IncomingMessageWithBody<any>, res) => {
		await json<IEntity>(req, res);
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
				const { name, password } = req.body;
				const newUserData = { name, password };
				try {
					users.edit(userTofindIndex, newUserData);
				} catch (error) {
					console.log(error);
				}
			}
		}
	}
);

server.listen(port, () => {
	console.log(`listen on ${port}`);
});
