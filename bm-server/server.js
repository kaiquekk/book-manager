const express = require('express');
const request = require('request');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const bodyParser = require('body-parser')
const data = require('./users/users.json');
const list = require('./booklists/booklists.json');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());

app.route('/api/users/auth').post((req, response) => {
    const user = req.body.username;
    const pass = hash(req.body.password);
    const users = new Map();
    for (us of data) {
        users.set(String(us.username), us);
    }
    if (users.get(user).password === pass) {
        response.send(users.get(user))
    }
    else {
        response.status(400).send({ message: 'Invalid Password' });
    }
})

app.route('/api/users/register').post((req, response) => {
    const users = new Map();
    for (us of data) {
        users.set(String(us.username), us);
    }
    if (users.get(req.body.username) !== undefined){
        response.status(400).send({ message: 'User already exists' });
    }
    else {
        const currentUsers = data;
        currentUsers.push({ "userId": generateId(req.body.username), "username": req.body.username,
            "password": hash(req.body.password), "firstName": req.body.firstName, 
            "lastName": req.body.lastName, "age": req.body.age, "email": req.body.email })
        fs.writeFile('./users/users.json', JSON.stringify(currentUsers, null, 1), err => {
            if (err) response.status(400).send({ message: 'Error writing to db '});
            response.send(users.get(req.body.username))
        })
    }
})

app.route('/api/books/:key').get((req, response) => {
    const key = req.params['key'];
    request(`https://api.itbook.store/1.0/search/${key}`, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        response.send(body);
    })
})

app.route('/api/book/:isbn').get((req, response) => {
    const isbn = req.params['isbn'];
    request(`https://api.itbook.store/1.0/books/${isbn}`, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        response.send(body);
    })
})

app.route('/api/users/:userId/list').get((req, response) => {
    const id = req.params['userId'];
    const lists = new Map();
    for (l of list) {
        lists.set(String(l.userId), l);
    }
    if (lists.get(id).books !== undefined) {
        response.send(lists.get(id).books)
    }
    else {
        response.status(400).send({ message: 'Invalid user id' })
    }

})

app.route('/api/users/:userId/list/:isbn').delete((req, response) => {
    const id = req.params['userId'],
        isbn = req.params['isbn'],
        userIndex = list.map(item => {
            return item['userId'] 
        }).indexOf(+id),
        bookIndex = list[userIndex].books.map(item => {
            return item['isbn']
        }).indexOf(+isbn);
    list[userIndex].books.splice(bookIndex, 1);
    fs.writeFile('./booklists/booklists.json', JSON.stringify(list, null, 2), err => {
        if (err) response.status(400).send({ message: 'Error writing to db '});
        response.status(200).send();
    })

})

app.route('/api/users/:userId/list').post((req, response) => {
    const id = req.params['userId'],
        book = req.body,
        userIndex = list.map(item => {
            return item['userId']
        }).indexOf(+id);
    if (list[userIndex].books.indexOf(book) < 0) {
        list[userIndex].books.push(book);
        fs.writeFile('./booklists/booklists.json', JSON.stringify(list, null, 2), err => {
            if (err) response.status(400).send({ message: 'Error writing to db '});
            response.status(200).send();
        })
    }
    else {
        response.status(400).send({ message: 'Book already in list' })
    }
})

function hash(pass) {    
    const sha = crypto.createHash('sha256');
    return sha.update(pass).digest('hex');
}

function generateId(username) {
    let id = 7;
    for (let i = 0; i < username.length; i++) {
        id = id * 31 + username.charCodeAt(i);
    }
    return id;
}

app.listen(8000, () => {
    console.log('Book Manager Server started.');
})