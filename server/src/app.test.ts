import request from "supertest";
import { app } from "../src/app";

describe("GET /view/all", () => {
  test("It should respond with an array of issues", async () => {
    const response = await request(app).get("/api/v1/view/all");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("GET /view/:id", () => {
  test("It should respond with a specific issue", async () => {
    const response = await request(app).get("/api/v1/view/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });

  test("It should respond with 404 when issue is not found", async () => {
    const response = await request(app).get("/api/v1/view/1000");
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Issue with ID 1000 not found");
  });
});

describe("POST /create", () => {
  test("It should create a new issue", async () => {
    const issue = {
      title: "New issue",
      description: "Description of new issue",
    };
    const response = await request(app).post("/api/v1/create").send(issue);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("title", "New issue");
    expect(response.body).toHaveProperty(
      "description",
      "Description of new issue"
    );
  });

  test("It should respond with an error when title is missing", async () => {
    const issue = { description: "Description of new issue" };
    const response = await request(app).post("/api/v1/create").send(issue);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Please provide a title for the issue");
  });

  test("It should respond with an error when description is missing", async () => {
    const issue = { title: "New issue" };
    const response = await request(app).post("/api/v1/create").send(issue);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Please provide a description for the issue");
  });
});

describe("PUT /update/:id", () => {
  test("It should update an existing issue", async () => {
    const issue = {
      title: "Updated issue",
      description: "Updating the description",
    };
    const response = await request(app).put("/api/v1/update/1").send(issue);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated issue");
    expect(response.body).toHaveProperty(
      "description",
      "Updating the description"
    );
  });

  test("It should respond with an error when title is missing", async () => {
    const issue = { description: "Updating the description" };
    const response = await request(app).put("/api/v1/update/1").send(issue);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Please provide a title to update the issue");
  });

  test("It should respond with an error when description is missing", async () => {
    const issue = { title: "Updated issue" };
    const response = await request(app).put("/api/v1/update/1").send(issue);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(
      "Please provide a description to update the issue"
    );
  });

  test("It should respond with 404 when issue is not found", async () => {
    const issue = {
      title: "Updated issue",
      description: "Updating the description",
    };
    const response = await request(app).put("/api/v1/update/1000").send(issue);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Issue with ID 1000 not found");
  });
});

describe("DELETE /delete/:id", () => {
  test("It should delete an existing issue", async () => {
    const response = await request(app).post("/api/v1/delete/1");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Issue with ID 1 has been deleted");
  });

  test("It should respond with 404 when issue is not found", async () => {
    const response = await request(app).post("/api/v1/delete/1000");
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Issue with ID 1000 not found");
  });
});
