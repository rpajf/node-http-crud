import http from 'http';
import { config } from 'dotenv';
import { json, IncomingMessageWithBody } from './middlewares/json';
import { routes } from './routes/routes';
import { IEntity } from './types/entity';
import * as urlModule from 'url';

config();
const port = process.env.PORT || 3000;
// const entityPersistor = new EntityPersistor();

const server = http.createServer(
	async (req: IncomingMessageWithBody<any>, res) => {
		await json<IEntity>(req, res);
		const { method, url } = req;

		try {
			routes.find((route) => {
				if (route.method === method && route.path === url) {
					return route.handler(req, res);
				}
			});
		} catch (error) {
			console.log('error', error);
		}

		if (req.method === 'PUT') {
			const parsedUrl = urlModule.parse(req.url!, true).pathname;
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
