const express = require("express");
const router = express.Router();
const models = require("../models");

//Get tasks
router.get("/get/:userId", async (req, res) => {
  let response = {
    status: "ERROR",
    message: "Get Error",
  };
  if (!req.body) {
    res.status(403).json(response);
  } else {
    const { userId } = req.params;
    //console.log(req.params);
    const dbResponse = await models.Tasks.findAll({
      where: { userId: userId },
      returning: true,
    });
    //console.log("resp: " + JSON.stringify(dbResponse));
    if (dbResponse) {
      response.status = "Success";
      response.message = "Tasks list found!";
      response["data"] = dbResponse;
      res.status(200).send(response);
    } else {
      response.message = "ERROR!";
      res.status(404).json(response);
    }
  }
});
//Add task
router.post("/add", async (req, res) => {
  let response = {
    status: "ERROR",
    message: "Add Error",
  };
  if (!req.body) {
    res.status(403).json(response);
  } else {
    const { userId, name } = req.body;
    let now = new Date();
    now.setDate(now.getDate() + 2 * 7);
    const dbResponse = await models.Tasks.create({
      name,
      userId,
      isComplete: false,
      dueDate: now,
    });
    //console.log("resp: " + JSON.stringify(dbResponse));
    if (dbResponse) {
      response.status = "Success";
      response.message = "Task Added!";
      response["data"] = { taskId: dbResponse.id };
      res.status(200).send(response);
    } else {
      response.message = "ERROR!";
      res.status(404).json(response);
    }
  }
});
//Update task
router.put("/update", async (req, res) => {
  let response = {
    status: "ERROR",
    message: "Update Error",
  };
  if (!req.body) {
    res.status(403).json(response);
  } else {
    const { taskId, name, isComplete } = req.body;

    const dbResponse = await models.Tasks.update(
      {
        name,
        isComplete,
      },
      { where: { id: taskId }, returning: true }
    );
    //console.log("resp: " + JSON.stringify(dbResponse));
    if (dbResponse) {
      response.status = "Success";
      response.message = "Task updated!";
      response["data"] = { taskId: dbResponse.id };
      res.status(200).send(response);
    } else {
      response.message = "ERROR!";
      res.status(404).json(response);
    }
  }
});
//Delete task
router.post("/delete", async (req, res) => {
  let response = {
    status: "ERROR",
    message: "Delete Error",
  };
  if (!req.body) {
    res.status(403).json(response);
  } else {
    const { taskId } = req.body;
    const dbResponse = await models.Tasks.destroy({
      where: { id: taskId },
      returning: true,
    });
    //console.log("resp: " + JSON.stringify(dbResponse));
    if (dbResponse) {
      response.status = "Success";
      response.message = "Task Deleted!";
      response["data"] = { taskId: dbResponse.id };
      res.status(200).send(response);
    } else {
      response.message = "ERROR!";
      res.status(404).json(response);
    }
  }
});

module.exports = router;
