import * as express from "express";
import { TodoModel } from "../models/todo";

const todoRouter: express.Router = express.Router();
const todoModel = new TodoModel();
todoModel.initialize();

/* GET home page. */
todoRouter.get("/", async (req, res, next) => {
    const page = Number.parseInt(req.query.page || 1);
    const pageSize = Number.parseInt(req.query.pageSize || 100);
    const results = await todoModel.getAll(page, pageSize);
    res.json(results);
});

todoRouter.get("/:id", async (req, res, next) => {
    const id = req.param("id");
    if (!id) {
        res.status(404);
        return res.json({});
    }
    const results = await todoModel.get(Number.parseInt(id));
    if (!results) {
        res.status(404);
        res.json({});
    } else {
        res.json(results);
    }
});

todoRouter.put("/", async (req, res, next) => {
    const text = req.body.text;
    if (!text) {
        res.status(400);
        res.json({
            error: "Body must contain \"text\" property",
        });
        return;
    }

    const results = await todoModel.add(text);
    res.json(results);
});

todoRouter.post("/:id/toggleDone", async (req, res, next) => {
    const id = req.param("id");
    if (!id) {
        res.status(404);
        return res.json({});
    }
    const results = await todoModel.toggleDone(Number.parseInt(id));
    if (!results) {
        res.json(404);
        res.json({});
    } else {
        res.json(results);
    }
});

todoRouter.delete("/:id", async (req, res, next) => {
    const id = req.param("id");
    if (!id) {
        res.status(404);
        return res.json({});
    }
    const results = await todoModel.remove(Number.parseInt(id));
    if (!results) {
        res.status(404);
        res.json({});
    } else {
        res.json(results);
    }
});

export {
    todoRouter as TodoRouter
};
