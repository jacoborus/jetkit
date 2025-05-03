import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { eq } from "drizzle-orm";
import * as tables from "./tables";
import config, { DB_URL } from "@/config";
import db from "./db";
import auth from "@/auth/auth-service";
import userRepo from "@/user/user-repo";

const conn = drizzle(DB_URL, {
  schema: tables,
});

const main = async () => {
  await migrate(conn, {
    migrationsFolder: "./.migrations",
  });

  // create admin role if it doesn't exists
  const roles = await db.query.role.findMany({
    columns: {
      id: true,
    },
  });
  const roleNames = roles.map((role) => role.id);

  if (!roleNames.includes("admin")) {
    await db.insert(tables.role).values([{ id: "admin" }]);
  }

  if (!roleNames.includes("regular")) {
    await db.insert(tables.role).values([{ id: "regular" }]);
  }

  // create admin user if it doesn't exists
  const users = await db.query.user.findMany({
    columns: {
      id: true,
    },
    limit: 1,
  });

  if (users.length === 0) {
    const adminUser = await auth.api.signUpEmail({
      body: {
        email: config.ADMIN_EMAIL,
        name: "Admin",
        password: config.ADMIN_PASSWORD,
      },
    });

    await db
      .update(userRepo)
      .set({ role: "admin" })
      .where(eq(userRepo.id, adminUser.user.id));
  }

  process.exit(0);
};

main();
