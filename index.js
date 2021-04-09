const Joi = require('joi');
const express = require('express');
const app = express();

let html = `<!DOCTYPE html>
<html>
    <head>
        <style>
            table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }

            td,
            th {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }

            tr:nth-child(even) {
                background-color: #dddddd;
            }
        </style>
    </head>
    <body>
        <h2>HTML Table</h2>
        <table>
            <tr>
                <td>SR_NO</td>
                <td>ID</td>
                <td>USER</td>
            </tr>
        </table>
    </body>
</html>
`;

app.use(express.json());

const users =[
    {id :1, name: 'user1'},
    {id :2, name: 'user2'},
    {id :3, name: 'user3'},
];

app.get('/',(req,res)=> {
    res.send('Hello World!!!');
});

app.get('/api/users', (req,res) => {
    res.send(users);
});

app.post('/api/users', (req,res) => {
    const { error } = validateUser(req.body);

    if(error) {
   return res.status(400).send(error.details[0].message);
    
}


    const user ={
        id : users.length + 1,
        name: req.body.name
    }
    users.push(user);
    res.send(user);
})

app.put('/api/users/:id', (req,res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user){
      return res.status(404).send('The user with the given ID was not found.');
    }
    
    const { error } = validateUser(req.body);

    if(error) {
     return res.status(400).send(error.details[0].message);
    }

    user.name = req.body.name
    res.send(user);


});



app.delete('/api/users/:id', (req,res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    const index = users.indexOf(user);
    users.splice(index,1);

    res.send(user);
})


function validateUser(user){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(user,schema);

}


app.get('/api/users/:id', (req,res) => {
 const user = users.find(c => c.id === parseInt(req.params.id));
 if (!user) return res.status(404).send('The user with the given ID was not found.');
 res.send(user);
});

app.get("/users/all", (req, res) => {
    html = html.replace("HTML Table", "");
    let final = html;
    users.map((item) => {
        final = final
            .replace("ID", item.id)
            .replace("SR_NO", item.id)
            .replace("USER", item.name);
        final += html;
    });
    final = final.replace("SR_NO", "").replace("ID", "").replace("USER", "");
    res.send(final);
});

app.get("/users/:userId", (req, res) => {
    const userId = req.params.userId;
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            res.send(
                html
                    .replace("ID", users[i].id)
                    .replace("USER", users[i].name)
                    .replace("SR_NO", users[i].id)
            );
            return;
        }
    }
});

const port = process.env.port || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));