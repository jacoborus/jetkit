// import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
// import { HTTPException } from "hono/http-exception";
// import jsonContent from "stoker/openapi/helpers/json-content";
// import { IdParamsSchema } from "../api/api-schemas";
//
// import { genericResponse, genericResponses } from "../api/api-schemas";
// import { requireAuthMiddleware } from "../auth/auth-middleware";
// // import { ListOptions } from "src/api/api-schemas";
// import * as service from "./device-service";
// import * as schemas from "./device-schemas";
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
//     operationId: "listOwnDevices",
//     summary: "List all the devices",
//     method: "get",
//     path: "/",
//     responses: {
//       200: jsonContent(
//         z.array(schemas.DeviceSelectSchema),
//         "The users game setups",
//       ),
//       ...genericResponses,
//     },
//     tags: ["Device"],
//   }),
//   async (c) => {
//     const author = c.get("userId");
//     const games = await service.list(author);
//     return c.json(games, 200);
//   },
// );
//
// // GET /{id}
// router.openapi(
//   createRoute({
//     operationId: "getDeviceById",
//     summary: "Get one Device by id",
//     method: "get",
//     path: "/{id}",
//     tags: ["Device"],
//     request: { params: IdParamsSchema },
//     responses: {
//       200: jsonContent(schemas.DeviceSelectSchema, "Retrieve the game setup"),
//       ...genericResponse(404, "Not found"),
//       ...genericResponses,
//     },
//   }),
//   async (c) => {
//     const { id } = c.req.valid("param");
//     const game = await service.getById(id);
//     if (!game) {
//       throw new HTTPException(404, { message: "Not found" });
//     }
//     return c.json(game, 200);
//   },
// );
//
// // POST /
// router.openapi(
//   createRoute({
//     operationId: "createDevice",
//     summary: "Create one game setup",
//     method: "post",
//     path: "/",
//     tags: ["Device"],
//     request: { body: jsonContent(schemas.DeviceCreateSchema, "a game object") },
//     responses: {
//       201: jsonContent(schemas.DeviceSelectSchema, "New Device"),
//       ...genericResponses,
//     },
//   }),
//   async (c) => {
//     const body = c.req.valid("json");
//     const author = c.get("userId");
//     const game = await service.create({ ...body, author, connected: false });
//     return c.json(game, 201);
//   },
// );
//
// // // POST /
// // router.openapi(
// //   createRoute({
// //     operationId: "updateDevice",
// //     summary: "Update a game setup",
// //     method: "patch",
// //     path: "/{id}",
// //     tags: ["Device"],
// //     request: {
// //       params: IdParamsSchema,
// //       body: jsonContent(schemas.DeviceUpdateSchema, "a game update"),
// //     },
// //     responses: {
// //       201: jsonContent(schemas.DeviceSelectSchema, "Ok"),
// //       ...genericResponses,
// //     },
// //   }),
// //   async (c) => {
// //     const payload = c.req.valid("json");
// //     const { id } = c.req.valid("param");
// //     const author = c.get("userId");
// //     const game = await service.updateOwnDevice(id, author, { ...payload });
// //     return c.json(game, 201);
// //   },
// // );
//
// // DELETE /{id}
// router.openapi(
//   createRoute({
//     operationId: "deleteDevice",
//     summary: "Delete a game setup",
//     method: "delete",
//     path: "/{id}",
//     tags: ["Device"],
//     request: { params: IdParamsSchema },
//     responses: {
//       200: jsonContent(IdParamsSchema, "Deleted game successfully"),
//       ...genericResponses,
//     },
//   }),
//   async (c) => {
//     const { id } = c.req.valid("param");
//     await service.remove(id);
//     return c.json({ id }, 200);
//   },
// );
//
// export default router;
