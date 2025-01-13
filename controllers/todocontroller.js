const Todo = require('../models/Todo');

const createTodo = async (req, res) => {
    try {
        const { title } = req.body;
        const newTodo = new Todo({ title });
        await newTodo.save();
        res.redirect('/list');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating todo');
    }
};

const getTodoList = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.render('list', { todos });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching todos');
    }
};

module.exports = { createTodo, getTodoList };