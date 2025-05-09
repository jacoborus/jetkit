import { drizzle } from "drizzle-orm/node-postgres";

import { DB_URL } from "../../config";
import * as schema from "./tables";

const db = drizzle(DB_URL, { schema });

export default db;
