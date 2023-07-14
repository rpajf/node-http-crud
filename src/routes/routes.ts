import { Entity } from '../controllers/entity-controller';
import { IncomingMessageWithBody } from '../middlewares/json';
import { IEntity } from '../types/entity';
import http from 'http';

interface RoutesMethods {
	method: string;
	path: string;
	handler: (
		req: IncomingMessageWithBody<any>,
		res: http.ServerResponse
	) => Promise<void>;
}
const users = new Entity<IEntity>([]);
export const routes: RoutesMethods[] = [
	{
		method: 'POST',
		handler: async (req, res) => {
			const { name, password } = req.body;
			const user = { name, password };
			await users.create(user);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end('user added');
		},
		path: '/users',
	},
	{
		method: 'GET',
		handler: async (req, res) => {
			const allUsers = users.list();
			res.end(JSON.stringify(allUsers));
		},
		path: '/users',
	},
];
