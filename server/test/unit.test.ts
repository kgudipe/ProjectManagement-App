import test from "node:test";
import assert from "node:assert/strict";

import { HttpError, notFoundError } from "../src/lib/httpError.ts";
import { createProjectSchema, updateProjectSchema } from "../src/schemas/projectSchemas.ts";
import { createTaskSchema } from "../src/schemas/taskSchemas.ts";

test("HttpError carries a status code", () => {
  const err = new HttpError(418, "teapot");
  assert.equal(err.status, 418);
  assert.equal(err.message, "teapot");
  assert.ok(err instanceof Error);
});

test("notFoundError builds a 404", () => {
  const err = notFoundError("Project");
  assert.equal(err.status, 404);
  assert.match(err.message, /Project not found/);
});

test("createProjectSchema accepts a minimal valid project", () => {
  const parsed = createProjectSchema.parse({ name: "Apollo" });
  assert.equal(parsed.name, "Apollo");
});

test("createProjectSchema rejects an empty name", () => {
  assert.throws(() => createProjectSchema.parse({ name: "" }));
});

test("updateProjectSchema rejects an empty payload", () => {
  assert.throws(() => updateProjectSchema.parse({}));
});

test("createTaskSchema coerces numeric ids from strings", () => {
  const parsed = createTaskSchema.parse({
    title: "Build login",
    projectId: "3",
    authorUserId: "7",
  });
  assert.equal(parsed.projectId, 3);
  assert.equal(parsed.authorUserId, 7);
});
