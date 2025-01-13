const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/create', todoController.createTodo);

router.get('/list', todoController.getTodoList);

module.exports = router;