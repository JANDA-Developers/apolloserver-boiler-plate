import path from "path";

require("dotenv").config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev"
  ),
});
