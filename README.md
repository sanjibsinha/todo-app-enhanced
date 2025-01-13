## 1. Installing Node.js on Ubuntu

### Using the Official Installer

Run the following commands to install Node.js:

```bash
curl -sL https://deb.nodesource.com/setup_19.x | sudo -E bash -
sudo apt-get install -y nodejs
```

This will install Node.js version 19.x. You can replace `19.x` with your desired version.

### Verify Installation

Once Node.js is installed, check the versions of Node.js and npm by running:

```bash
node -v
npm -v
```

This will display the installed versions of Node.js and npm.

---

## 2. Setting up a Local Development Environment

### Create a Project Directory

Start by creating a project directory:

```bash
mkdir my-web-app
cd my-web-app
```

## Initialize npm

Run the following command to initialize npm:

```bash
npm init -y
```

This will generate a `package.json` file that will manage your project's dependencies.

## Building a To-Do List Application with Express.js, MongoDB, and EJS

### 1. Project Setup

Start by creating a new project directory and initialize npm:

```bash
mkdir todo-app-enhanced
cd todo-app-enhanced
npm init -y
```

Next, install the necessary dependencies:

```bash
npm install express mongoose ejs body-parser
```

**Dependencies:**
- **express**: For building the web application.
- **mongoose**: For interacting with MongoDB.
- **ejs**: For templating and rendering HTML.
- **body-parser**: For parsing form data (handling POST requests).

### 2. MongoDB Setup

If MongoDB is not installed on your system, follow the installation guide on the [official MongoDB website](https://www.mongodb.com/docs/manual/installation/). After installing, start MongoDB:

```bash
sudo systemctl start mongod
```
### 3. Create Mongoose Schema

Create the **Todo model** by creating a file `models/Todo.js`:

```javascript
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Todo', todoSchema);
```

This schema will store the to-do title and completion status.

### 4. Connect to MongoDB

In your **server.js** file, connect to MongoDB using Mongoose:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/index');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

app.use(bodyParser.urlencoded({ extended: true })); // For parsing form data
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.use(express.static('public')); // Serve static files (e.g., CSS)

app.use('/', routes); // Use routes defined in routes/index.js

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### 5. Create Routes and Controllers

Create the controller for handling to-do operations:

**controllers/todoController.js**

```javascript
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
```

Next, create the routes:

**routes/index.js**

```javascript
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/create', todoController.createTodo);

router.get('/list', todoController.getTodoList);

module.exports = router;
```

### 6. Set Up Views (using EJS) and Basic CSS

Create the views and styles for the application:

**views/index.ejs**

```html
<!DOCTYPE html>
<html>
<head>
    <title>To-Do List</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Add a To-Do</h1>
        <form action="/create" method="POST">
            <input type="text" name="title" placeholder="Enter To-Do" required>
            <button type="submit">Add</button>
        </form>
    </div>
</body>
</html>
```

**views/list.ejs**

```html
<!DOCTYPE html>
<html>
<head>
    <title>To-Do List</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>To-Do List</h1>
        <ul>
            <% todos.forEach(todo => { %>
                <li><%= todo.title %></li>
            <% }); %>
        </ul>
    </div>
</body>
</html>
```

**public/styles.css**

```css
/* Basic styling for the to-do app */
.container {
    width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

form {
    display: flex;
    flex-direction: column;
}

input[type="text"] {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

button {
    padding: 10px;
    background-color: #28a745;
    border: none;
    border-radius: 3px;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #218838;
}

ul {
    list-style: none;
    padding-left: 0;
}

ul li {
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
}
```

### 7. Complete `server.js`

Finally, ensure the **server.js** file includes the setup for static file serving and middleware for parsing request bodies:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/index');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public')); // Serve static files like CSS

app.use('/', routes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### 8. Run the Application

Start the application by running:

```bash
node server.js
```

Visit [http://localhost:3000](http://localhost:3000) to view the to-do list app in action.
