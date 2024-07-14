import buildServer from "./server";

const server = buildServer();

async function main() {
  try {
    await server.listen({ port: process.env.APP_PORT }, (err, address) => {
      if (err) {
        console.log("error exectued");
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
