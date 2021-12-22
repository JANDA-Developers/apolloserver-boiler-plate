import "reflect-metadata";
import "./utils/config";
import "reflect-metadata";
import "./utils/config";
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { connect } from "mongoose";

const main = async () => {

    // MONGODB CONFIGURATION
  connect(process.env.DB_URL!).then(() => {
    console.log("📝 MongoDB TEST DB CONNECTED...!");
  });

  
  // EXPRESS CONFIGURATIONs
  const app = express();
  app.use(express.json());

  app.use((error, _, __, next) => {
    console.error(error);
    next();
  });

  app.listen({ port: process.env.PORT }, () => {
    console.log(new Date());
    console.log(
      `🚗  Server Ready at ${process.env.SERVER_URL}:${process.env.PORT}/graphql`
    );
  });

  try {
    // APOLLO CONFIGURATION
    const schema = await buildSchema({
      resolvers: [__dirname + "/**/*/*.{resolver,resolvers,type}.{ts,js}"],
      dateScalarMode: "isoDate",
    });

    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      schema: schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    server.start().then(() => {
      console.log("💡 GraphQL Server Start...!!");
      server.applyMiddleware({
        app,
        cors: {
          credentials: true,
          origin: ["http://localhost:3000", "https://studio.apollographql.com"],
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

main();
