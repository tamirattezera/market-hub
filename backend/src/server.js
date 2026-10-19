import "dotenv/config";
import app from "./app.js";
import { getServerConfig } from "./config.js";

const { port } = getServerConfig();

app.listen(port, () => {
  console.log(`Market Hub API listening on port ${port}`);
});
