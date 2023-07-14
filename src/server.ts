import http from 'http';
import { config } from 'dotenv';
import { json, IncomingMessageWithBody } from './middlewares/json';
import { routes } from './routes/routes';
import { IEntity } from './types/entity';

config();
const port = process.env.PORT || 3000;

const server = http.createServer(
	async (req: IncomingMessageWithBody<any>, res) => {
		await json<IEntity>(req, res);
		const { method, url } = req;

		const route = routes.find(
			(route) => route.method === method && route.path.test(url!)
		);
		if (route && req.url) {
			const routeParams = req.url.match(route.path);
			if (routeParams !== null) {
				const { groups } = routeParams;
				req.params = groups;
		}
			// const { groups } = routeParams;
			// req.params = groups;
			try {
				route.handler(req, res);
			} catch (error) {
				console.log('error', error);
			}
		}
	}
);

server.listen(port, () => {
	console.log(`listen on ${port}`);
});
