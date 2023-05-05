import express, { Application, NextFunction, Request, Response } from "express";
import issues from "./@data/issues.json";
import bodyParser from "body-parser";

export const app: Application = express();

const PORT = 3000;

type IssueType = {
  id: number;
  title: string;
  description: string;
};

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!");
});

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toLocaleDateString()}] ${req.method} ${req.path}`);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/v1/view/all", (req: Request, res: Response) => {
  res.send(issues);
});

// READ
app.get("/api/v1/view/:id", (req: Request, res: Response) => {
  if (req.method !== "GET") {
    res.status(405).send(`Please use GET method to view an issue`);
  }
  const id = Number(req.params.id);

  const issue = issues.find((issue: IssueType) => issue.id === id);
  if (!issue) {
    // If no issue is found, return a 404 response
    res.status(404).send(`Issue with ID ${id} not found`);
  } else {
    // If an issue is found, return the issue object
    res.send(issue);
  }
});

// CREATE
app.post("/api/v1/create", (req: Request, res: Response) => {
  if (req.method !== "POST") {
    res.status(405).send(`Please use POST method to create an issue`);
  }

  console.log(req.body);

  const { title, description } = req.body;

  if (!title) {
    res.status(400).send(`Please provide a title for the issue`);
  } else if (!description) {
    res.status(400).send(`Please provide a description for the issue`);
  }

  // Create a new issue object
  const newIssue: IssueType = {
    id: issues.length + 1,
    title,
    description,
  };

  // Add the new issue object to the issues array
  issues.push(newIssue);

  // Return the new issue object
  res.send(newIssue);
});

app.put("/api/v1/update/:id", (req: Request, res: Response) => {
  if (req.method !== "PUT") {
    res.status(405).send(`Please use PUT method to update the issue`);
  }

  const id = Number(req.params.id);

  const issue = issues.find((issue: IssueType) => issue.id === id);

  if (!issue) {
    // If no issue is found, return a 404 response
    res.status(404).send(`Issue with ID ${id} not found`);
  }

  const { title, description } = req.body;
  // checking for titles & descriptions to update the issue
  if (!title) {
    res.status(400).send(`Please provide a title to update the issue`);
  } else if (!description) {
    res.status(400).send(`Please provide a description to update the issue`);
  }

  // Update the issue object
  if (issue) {
    issue.title = title;
    issue.description = description;
  }
  // Return the updated issue object
  res.send(issue);
});

app.post("/api/v1/delete/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const issue = issues.find((issue: IssueType) => issue.id === id);

  if (!issue) {
    // If no issue is found, return a 404 response
    res.status(404).send(`Issue with ID ${id} not found`);
  }

  // Delete the issue object
  if (issue) {
    issues.splice(issues.indexOf(issue), 1);
  }
  // Return the deleted issue object
  res.send(`Issue with ID ${id} has been deleted`);
});

app.listen(3000, () => {
  console.log(`Server listening on port ${PORT}`);
});
