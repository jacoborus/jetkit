// import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
// // import { HTTPException } from "hono/http-exception";
// import jsonContent from "stoker/openapi/helpers/json-content";
// import { IdParamsSchema } from "../api/api-schemas";
//
// import {
//   // genericResponse,
//   genericResponses,
// } from "../api/api-schemas";
// import { requireAuthMiddleware } from "../auth/auth-middleware";
// // import { ListOptions } from "src/api/api-schemas";
// import * as service from "./remote-service";
// import * as schemas from "./remote-schemas";
//
// const router = new OpenAPIHono<{
//   Variables: {
//     userId: string;
//   };
// }>();
//
// router.use(requireAuthMiddleware);
//
// // GET /
// router.openapi(
//   createRoute({
//     operationId: "listDeviceRemotes",
//     summary: "List all the remotes linked to a device",
//     method: "get",
//     path: "/{id}",
//     request: { params: IdParamsSchema },
//     responses: {
//       200: jsonContent(
//         z.array(schemas.RemoteDeviceSelectSchema),
//         "The users game setups",
//       ),
//       ...genericResponses,
//     },
//     tags: ["Remote"],
//   }),
//   async (c) => {
//     const { id } = c.req.valid("param");
//     const remotes = await service.listBySharedDevice(id);
//     return c.json(remotes, 200);
//   },
// );
//
// // // GET /{id}
// // router.openapi(
// //   createRoute({
// //     operationId: "getRemoteById",
// //     summary: "Get one Remote by id",
// //     method: "get",
// //     path: "/{id}",
// //     tags: ["Remote"],
// //     request: { params: IdParamsSchema },
// //     responses: {
// //       200: jsonContent(schemas.RemoteSelectSchema, "Retrieve the game setup"),
// //       ...genericResponse(404, "Not found"),
// //       ...genericResponses,
// //     },
// //   }),
// //   async (c) => {
// //     const { id } = c.req.valid("param");
// //     const game = await service.getById(id);
// //     if (!game) {
// //       throw new HTTPException(404, { message: "Not found" });
// //     }
// //     return c.json(game, 200);
// //   },
// // );
// //
// // // POST /
// // router.openapi(
// //   createRoute({
// //     operationId: "createRemote",
// //     summary: "Create one game setup",
// //     method: "post",
// //     path: "/",
// //     tags: ["Remote"],
// //     request: { body: jsonContent(schemas.RemoteCreateSchema, "a game object") },
// //     responses: {
// //       201: jsonContent(schemas.RemoteSelectSchema, "New Remote"),
// //       ...genericResponses,
// //     },
// //   }),
// //   async (c) => {
// //     const body = c.req.valid("json");
// //     const author = c.get("userId");
// //     const game = await service.create({ ...body, author, connected: false });
// //     return c.json(game, 201);
// //   },
// // );
// //
// // // POST /
// // router.openapi(
// //   createRoute({
// //     operationId: "updateRemote",
// //     summary: "Update a game setup",
// //     method: "patch",
// //     path: "/{id}",
// //     tags: ["Remote"],
// //     request: {
// //       params: IdParamsSchema,
// //       body: jsonContent(schemas.RemoteUpdateSchema, "a game update"),
// //     },
// //     responses: {
// //       201: jsonContent(schemas.RemoteSelectSchema, "Ok"),
// //       ...genericResponses,
// //     },
// //   }),
// //   async (c) => {
// //     const payload = c.req.valid("json");
// //     const { id } = c.req.valid("param");
// //     const author = c.get("userId");
// //     const game = await service.updateOwnRemote(id, author, { ...payload });
// //     return c.json(game, 201);
// //   },
// // );
// //
// // // DELETE /{id}
// // router.openapi(
// //   createRoute({
// //     operationId: "deleteRemote",
// //     summary: "Delete a game setup",
// //     method: "delete",
// //     path: "/{id}",
// //     tags: ["Remote"],
// //     request: { params: IdParamsSchema },
// //     responses: {
// //       200: jsonContent(IdParamsSchema, "Deleted game successfully"),
// //       ...genericResponses,
// //     },
// //   }),
// //   async (c) => {
// //     const { id } = c.req.valid("param");
// //     await service.remove(id);
// //     return c.json({ id }, 200);
// //   },
// // );
//
// export default router;
