"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const todo_1 = require("../models/todo");
const todoRouter = express.Router();
exports.TodoRouter = todoRouter;
const todoModel = new todo_1.TodoModel();
todoModel.initialize();
todoRouter.get("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const page = Number.parseInt(req.query.page || 1);
    const pageSize = Number.parseInt(req.query.pageSize || 100);
    const results = yield todoModel.getAll(page, pageSize);
    res.json(results);
}));
todoRouter.get("/:id", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const id = req.param("id");
    if (!id) {
        res.status(404);
        return res.json({});
    }
    const results = yield todoModel.get(Number.parseInt(id));
    if (!results) {
        res.status(404);
        res.json({});
    }
    else {
        res.json(results);
    }
}));
todoRouter.put("/", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const text = req.body.text;
    if (!text) {
        res.status(400);
        res.json({
            error: "Body must contain \"text\" property",
        });
        return;
    }
    const results = yield todoModel.add(text);
    res.json(results);
}));
todoRouter.post("/:id/toggleDone", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const id = req.param("id");
    if (!id) {
        res.status(404);
        return res.json({});
    }
    const results = yield todoModel.toggleDone(Number.parseInt(id));
    if (!results) {
        res.json(404);
        res.json({});
    }
    else {
        res.json(results);
    }
}));
todoRouter.delete("/:id", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const id = req.param("id");
    if (!id) {
        res.status(404);
        return res.json({});
    }
    const results = yield todoModel.remove(Number.parseInt(id));
    if (!results) {
        res.status(404);
        res.json({});
    }
    else {
        res.json(results);
    }
}));
//# sourceMappingURL=todos.js.map