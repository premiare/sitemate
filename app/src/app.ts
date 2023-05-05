import axios, { AxiosError } from "axios";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const apiUrl = "http://localhost:3000";

interface Issue {
  id: number;
  title: string;
  description: string;
}

const createIssue = () => {
  rl.question("Enter issue title: ", (title) => {
    console.log(title);
    rl.question("Enter issue description: ", (description) => {
      const issue = {
        title: title,
        description: description,
      };
      axios
        .post<Issue>(`${apiUrl}/create`, issue)
        .then((response) => {
          console.log("New issue created:");
          console.log(response.data);
          menu();
        })
        .catch((error: AxiosError) => {
          console.log("Error creating issue:", error.message);
          menu();
        });
    });
  });
};

const viewIssue = () => {
  rl.question("Enter issue ID: ", (id) => {
    axios
      .get<Issue>(`${apiUrl}/view/${id}`)
      .then((response) => {
        console.log("Issue details:");
        console.log(response.data);
        menu();
      })
      .catch((error: AxiosError) => {
        console.log("This issue doesn't exist", error.message);
        menu();
      });
  });
};

const viewAllIssues = () => {
  axios
    .get<Issue[]>(`${apiUrl}/view/all`)
    .then((response) => {
      console.log("List of issues:");
      console.log(response.data);
      menu();
    })
    .catch((error: AxiosError) => {
      console.log("Error listing issues:", error.message);
      menu();
    });
};

const deleteIssue = () => {
  rl.question("Enter issue ID: ", (id) => {
    axios
      .delete(`${apiUrl}/delete/${id}`)
      .then((response) => {
        console.log("Issue deleted");
        console.log(response.data);
        menu();
      })
      .catch((error: AxiosError) => {
        console.log("Error deleting issue:", error.message);
        menu();
      });
  });
};

const menu = () => {
  rl.question(
    "Select an action:\n1. Create an issue\n2. View an issue\n3. List all issues\n4. Delete an issue\n",
    (answer) => {
      switch (answer) {
        case "1":
          createIssue();
          break;
        case "2":
          viewIssue();
          break;
        case "3":
          viewAllIssues();
          break;
        case "4":
          deleteIssue();
          break;
        default:
          console.log("Invalid option selected");
          menu();
          break;
      }
    }
  );
};

menu();
