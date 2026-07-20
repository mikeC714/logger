import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";
const server = fastify({
	logger: true,
});

server.get("/ping", async(req, rep) => {
	return rep.send("pong\n");
});

















server.setErrorHandler((err:any, req, rep) => {
	let status = 500;
	if(err instanceof AppError){
		return rep.status(err.statusCode).send({ ok: false , message: err.message }); 
	}
	return rep.status(status).send({ ok: false })
})
server.listen({ port: process.env.PORT }, async(err, address) => {
	if(err){
		console.error(`Error:${err}`);
		process.exit(1);
	};	
	console.log(`Server is listening on PORT:${address}`);
})


