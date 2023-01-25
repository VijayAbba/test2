const express = require("express");
const date = require("date-fns");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const { format, compareAsc } = date;

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const InitializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

InitializeDbAndServer();

const checkQueryMF = (request, response, next) => {
  const QueryDetails = request.query;
  const statusList = ["TO DO", "IN PROGRESS", "DONE", undefined];
  const priorityList = ["HIGH", "MEDIUM", "LOW", undefined];
  const categoryList = ["WORK", "HOME", "LEARNING", undefined];

  if (statusList.includes(QueryDetails.status) === false) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (priorityList.includes(QueryDetails.priority) === false) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (categoryList.includes(QueryDetails.category) === false) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else {
    next();
  }

  //   else if (categoryList.includes(QueryDetails.due_date) === false) {
  //     response.status(400);
  //     response.send("Invalid Due Date")
  // };
};

// test

app.get("/", checkQueryMF, async (request, response) => {
  // middle ware function
  const {
    status = "",
    priority = "",
    category = "",
    search_q = "",
    dueDate = "",
  } = request.query;
  const getTodoQuery = `
    SELECT 
      *
    FROM
        todo
    WHERE 
       todo LIKE '%${search_q}%' AND
       status LIKE '%${status}%' AND
       priority LIKE '%${priority}%' AND 
       category LIKE '%${category}%';`;
  const dbRes = await db.all(getTodoQuery);
  response.send(dbRes);
});

// API 1:
app.get("/todos/", checkQueryMF, async (request, response) => {
  // middle ware function
  const {
    status = "",
    priority = "",
    category = "",
    search_q = "",
    dueDate = "",
  } = request.query;
  const getTodoQuery = `
    SELECT 
        id,
        todo,
        priority,
        status,
        category,
        due_date AS dueDate
    FROM
        todo
    WHERE 
       todo LIKE '%${search_q}%' AND
       status LIKE '%${status}%' AND
       priority LIKE '%${priority}%' AND 
       category LIKE '%${category}%';`;
  const dbRes = await db.all(getTodoQuery);
  response.send(dbRes);
});

// API 2:

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
  SELECT  
      id,
      todo,
      priority,
      status,
      category,
      due_date AS dueDate 
    FROM 
      todo 
    WHERE 
      id = ${todoId};`;
  const dbResp = await db.get(getTodoQuery);
  response.send(dbResp);
});

//API 3:

const checkDateMf = async (request, response, next) => {
  const { date } = request.query;

  let fDate;
  let goodDateFormat;
  try {
    fDate = format(new Date(date), "yyyy-MM-dd");
    goodDateFormat = true;
  } catch (e) {
    goodDateFormat = false;
  }
  if (goodDateFormat) {
    request.fDate = fDate;
    next();
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
};

//API 3:

app.get("/agenda/", checkDateMf, async (request, response) => {
  const { fDate } = request;

  const getTodosDateQuery = `
    SELECT  
      id,
      todo,
      priority,
      status,
      category,
      due_date AS dueDate 
    FROM 
      todo 
    WHERE
      due_date = '${fDate}';`;
  const dbRes = await db.all(getTodosDateQuery);
  response.send(dbRes);
});

const checkDateMfTwo = async (request, response, next) => {
  const { dueDate } = request.body;
  let fDate;
  let goodDateFormat;
  try {
    fDate = format(new Date(dueDate), "yyyy-MM-dd");
    goodDateFormat = true;
  } catch (e) {
    goodDateFormat = false;
  }
  if (goodDateFormat) {
    request.fDate = fDate;
    next();
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
};

const checkQueryMFTwo = (request, response, next) => {
  const QueryDetails = request.body;
  const statusList = ["TO DO", "IN PROGRESS", "DONE", undefined];
  const priorityList = ["HIGH", "MEDIUM", "LOW", undefined];
  const categoryList = ["WORK", "HOME", "LEARNING", undefined];

  if (statusList.includes(QueryDetails.status) === false) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (priorityList.includes(QueryDetails.priority) === false) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (categoryList.includes(QueryDetails.category) === false) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else {
    next();
  }

  //   else if (categoryList.includes(QueryDetails.due_date) === false) {
  //     response.status(400);
  //     response.send("Invalid Due Date")
  // };
};

///
const checkDateMfFour = async (request, response, next) => {
  const { dueDate } = request.body;
  let fDate;
  let goodDateFormat;
  if (dueDate !== undefined) {
    try {
      fDate = format(new Date(dueDate), "yyyy-MM-dd");
      goodDateFormat = true;
    } catch (e) {
      goodDateFormat = false;
    }
    if (goodDateFormat) {
      request.fDate = fDate;
      next();
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  } else {
  }
};
//

const checkQueryMFive = (request, response, next) => {
  const QueryDetails = request.body;
  const statusList = ["TO DO", "IN PROGRESS", "DONE"];
  const priorityList = ["HIGH", "MEDIUM", "LOW"];
  const categoryList = ["WORK", "HOME", "LEARNING"];

  if (statusList.includes(QueryDetails.status) === false) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (priorityList.includes(QueryDetails.priority) === false) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (categoryList.includes(QueryDetails.category) === false) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else {
    next();
  }

  //   else if (categoryList.includes(QueryDetails.due_date) === false) {
  //     response.status(400);
  //     response.send("Invalid Due Date")
  // };
};

// API 4:
app.post(
  "/todos/",
  checkQueryMFive,
  checkDateMfFour,
  async (request, response) => {
    const { fDate } = request;
    const { id, todo, status, priority, category, dueDate } = request.body;
    const createTodoQuery = `
    INSERT INTO
        todo (id,todo,category,priority,status,due_date)
    VALUES
        (${id},'${todo}', '${status}', '${priority}', '${category}', '${fDate}');`;
    console.log(createTodoQuery);
    const dbResp = await db.run(createTodoQuery);
    console.log(dbResp.lastID);
    response.send("Todo Successfully Added");
  }
);

///todos/:todoId/

const checkDateMfThree = async (request, response, next) => {
  const { dueDate } = request.body;
  let fDate;
  let goodDateFormat;
  if (dueDate !== undefined) {
    try {
      fDate = format(new Date(dueDate), "yyyy-MM-dd");
      goodDateFormat = true;
    } catch (e) {
      goodDateFormat = false;
    }
    if (goodDateFormat) {
      request.fDate = fDate;
      next();
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  } else {
    next();
  }
};

// API 5:

app.put(
  "/todos/:todoId/",
  checkQueryMFTwo,
  checkDateMfThree,
  async (request, response) => {
    const { todoId } = request.params;
    const getTodoQuery = `SELECT * FROM todo WHERE id = ${todoId};`;
    const inDbResP = await db.get(getTodoQuery);

    let resText;

    const reqBody = request.body;
    if (reqBody.status !== undefined) {
      // updated status
      resText = "Status Updated";
    } else if (reqBody.priority !== undefined) {
      // updated priority
      resText = "Priority Updated";
    } else if (reqBody.todo !== undefined) {
      // updated todo
      resText = "Todo Updated";
    } else if (reqBody.category !== undefined) {
      // updated category
      resText = "Category Updated";
    } else if (reqBody.dueDate !== undefined) {
      // updated dueDate
      resText = "Due Date Updated";
    }

    if (inDbResP === undefined) {
    } else {
      const {
        todo = inDbResP.todo,
        priority = inDbResP.priority,
        status = inDbResP.status,
        category = inDbResP.category,
        dueDate = inDbResP.due_date,
      } = request.body;

      const updateTodoQuery = ` 
      UPDATE 
        todo
      SET
        todo = '${todo}',
        priority = '${priority}',
        status =  '${status}',
        category =  '${category}',
        due_date = '${dueDate}'
      WHERE 
        id = ${todoId};`;
      const dbResp = await db.run(updateTodoQuery);
      response.send(resText);
    }
  }
);

// API 6:

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const deleteQuery = `
        DELETE FROM 
            todo 
        WHERE
            id = ${todoId};`;
  await db.run(deleteQuery);

  response.send("Todo Deleted");
});

module.exports = app;
