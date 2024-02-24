import fastify from "fastify";
const server = fastify();
server.get("/ping", (req, res) => {
    return "pong/n";
});
server.listen({ port: 3001 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
