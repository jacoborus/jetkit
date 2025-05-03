import { createClient } from "@hey-api/openapi-ts";

createClient({
  plugins: ["@hey-api/client-fetch"],
  input: "apispec.json",
  output: "./src/rest/client",
});
