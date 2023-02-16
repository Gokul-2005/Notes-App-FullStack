const express = require('express'); //This line contains express module
const app = express(); //assigning express function to app variable
const database = require('mysql'); //This line contains mysql module
const ejs = require('ejs'); //This line contains ejs module
const bodyParser = require('body-parser'); //This line contains body-parser module
const path = require('path');
const port = 5050 ;


app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,'./views'));


let connection = database.createConnection({
    host : 'localhost',
    user : 'root',
    password : "",
    database : 'NotesApp',
});

//MiddleWare
// var urlencodedParser = bodyParser.urlencoded({extended : false});
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


connection.connect((error) => {
    if(error){
    console.log(error);
    }
    else{
        console.log("database Connected");
    }
})

let proceedCheck = true ;

app.post('/signIn',(req,response) => {
    const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const firstIndex = Math.floor(Math.random() * 26);
    const secondIndex = Math.floor(Math.random() * 26);
    const thirdIndex = Math.floor(Math.random() * 26);
    const prefix = alphabet[firstIndex]+alphabet[secondIndex]+alphabet[thirdIndex];
    const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    let userID = prefix + suffix;

    if(req.body.signType==='signUp'){
        let userData ;
        let QueryToGetInfo = `SELECT * FROM UserInfo ;`;
        connection.query(QueryToGetInfo,(err,res) => {
            if(err){
                console.log(err);
            }
            else{
                userData = JSON.parse(JSON.stringify(res));
                userData.forEach((ele)=>{
                    if(ele.UserName===req.body.username && ele.Password===req.body.password){
                        proceedCheck = false;
                    }
                })
                if(proceedCheck){
                    let queryForNewTable = `CREATE TABLE ${userID} (NoteBook_No INT(255),BoardName VARCHAR(255) PRIMARY KEY,NotesTask JSON, image BLOB);`
                    connection.query(queryForNewTable,(err,res) => {
                        if(err) console.log(err);
                        else console.log(res);
                    })

                    let queryForSignUp = `INSERT INTO UserInfo(Id, UserName, Password,image) VALUES ('${userID}','${req.body.username}','${req.body.password}','');`
        connection.query(queryForSignUp, (err,res) => {
            if(err){
                console.log(err);
            }
            else{
                response.send("user not found");
            }
        });
                }
                else{
                    response.send("User Already Exists");
                }
            }
        })
    }
    else{
        let userData ;
        let QueryToGetInfo = `SELECT * FROM UserInfo ;`;
        connection.query(QueryToGetInfo,(err,res) => {
            if(err){
                console.log(err);
            }
            else{
                let check = false ;
                let userID ;
                userData = JSON.parse(JSON.stringify(res));
                userData.forEach((ele)=>{
                    if(ele.UserName===req.body.username && ele.Password===req.body.password){
                        check = true;
                        userID = ele.Id;
                    }
                })
                if(check){
                        response.send(userID);
                }
                else{
                    response.send('User Not Found');
                }
            }
        })
    }
})

app.get('/signIn',(req,res) => {
    const obj = {
        cssPath : 'css/signIn.css',
        jsPath : 'js/signIn.js',
    }
    res.render("signIn",{obj})
} );

app.post('/index',(req,response) => {
    if(req.body.taskType==='newBook'){
     let queryToInsertNewNoteBook = `INSERT INTO ${req.body.UserID} (NoteBook_No,BoardName,NotesTask) VALUES('${req.body.NoteBook_No}','${req.body.NoteBookName}','${JSON.stringify([])}') ;`
    connection.query(queryToInsertNewNoteBook,(err,res) => {
        if(err) console.log(err);
        else {
            response.send("created")  
        };
    })
    }
    if(req.body.taskType==='deleteBook'){
        let queryToDelete = `DELETE FROM ${req.body.user} WHERE BoardName = '${req.body.taskNameToDelete}' `
        connection.query(queryToDelete,(err,res) => {
            if(err) console.log(err);
            else{
                response.send('done');
            }
        })
    }
    if(req.body.taskType==='insertProfileImage'){
        let queryToInsertProfile = `UPDATE UserInfo SET image = '${req.body.imageText}' WHERE Id = '${req.body.user}'`
        connection.query(queryToInsertProfile,(err,res)=> {
            if(err) console.log(err);
            else{
                response.send('done');
            }
        })
    }
    
})

app.get('/index',(req,response)=>{
    let NoteBooks ;
    let image;
    let queryToGetImage = `SELECT image FROM UserInfo WHERE Id='${req.query.user}'`;
    connection.query(queryToGetImage,(err,res)=>{
        if(err) console.log(err);
        else{
            image = JSON.parse(JSON.stringify(res));
            var enc = new TextDecoder("utf-8");
            var arr = new Uint8Array(image[0].image.data);
            image = enc.decode(arr);
            let queryToGetAllNoteBook = `SELECT * FROM ${req.query.user} ORDER BY NoteBook_No;`
            connection.query(queryToGetAllNoteBook,(err,res) => {
            if(err) console.log(err);
            else {
            NoteBooks = JSON.parse(JSON.stringify(res));
            const obj = {
            NoteBooks : NoteBooks,
            image : image,
            cssPath : 'css/index.css',
            jsPath : 'js/index.js',
            logoPath : 'Asssets/logo.png',
            }
            response.render('index',{obj})    
            }
    })
        }
    })
    
    
    
})

app.post('/taskPage',(req,response)=> {
    let taskArr;
    if(req.body.taskType==='newTask'){
    let queryToGetTask = `SELECT NotesTask FROM ${req.body.user} WHERE BoardName = '${req.body.boardName}'`
    connection.query(queryToGetTask,(err,res)=>{
        if(err) console.log(err);
        else{
            let obj = {} ;
            taskArr = JSON.parse(JSON.parse(JSON.stringify(res[0])).NotesTask);
            obj["taskName"]=req.body.taskName;
            obj["taskText"]=req.body.arr;
            let proceedCheck = true ;
            taskArr.forEach((ele) => {
                if(ele.taskName==req.body.taskName){
                    ele.taskText = req.body.arr
                    proceedCheck=false;
                }
            })
            if(proceedCheck){
                taskArr.push(obj);
            }
            let queryToUpdateTask = `UPDATE ${req.body.user} SET NotesTask = '${JSON.stringify(taskArr)}' WHERE BoardName = '${req.body.boardName}'; `
            connection.query(queryToUpdateTask,(err,res)=>{
                if(err) console.log(err);
                else{
                    response.send("Done")
                }
            })
        }
    })
    }
    if(req.body.taskType==='showTask'){
        let task;
        let queryToGetTask = `SELECT NotesTask FROM ${req.body.user} WHERE BoardName = '${req.body.boardName}' ;`
        connection.query(queryToGetTask,(err,res)=>{
            if(err) console.log(err);
            else{
                task =JSON.parse(JSON.parse(JSON.stringify(res[0])).NotesTask);
                task.forEach((ele)=>{
                    if(ele.taskName===req.body.taskname){
                        response.send(JSON.stringify(ele))
                    }
                })
            }
        })
    }
    if(req.body.taskType==='updateBoardName'){
        let queryToUpdateBoardName = `UPDATE ${req.body.user} SET BoardName = '${req.body.NewboardName}' WHERE NoteBook_No = '${req.body.BoardID}' `
        connection.query(queryToUpdateBoardName,(err,res)=>{
            if(err) console.log(err);
            else{
                response.send('Done');
            }
        })
    }
    if(req.body.taskType==='deleteTask'){
        let taskArr;
        let queryToGetTask = `SELECT NotesTask FROM ${req.body.user} WHERE BoardName = '${req.body.boardName}' ;`
        connection.query(queryToGetTask,(err,res) => {
            if(err) console.log(err);
            else{
                taskArr =JSON.parse(JSON.parse(JSON.stringify(res[0])).NotesTask);
                taskArr.forEach((ele,index) => {
                    if(ele.taskName === req.body.taskNameToDelete){
                        taskArr.splice(index,1);
                    }
                })
                let queryToUpdateTask = `UPDATE ${req.body.user} SET NotesTask = '${JSON.stringify(taskArr)}' WHERE BoardName = '${req.body.boardName}'; `
                connection.query(queryToUpdateTask,(err,res)=>{
                    if(err) console.log(err);
                    else{
                        response.send('Done');
                    }
                })
            }
        })
    }
});

app.get('/taskPage',(req,response) => {
    let taskArr ;
    let image;
    let queryToGetImage = `SELECT image FROM UserInfo WHERE Id='${req.query.user}'`;
    connection.query(queryToGetImage,(err,res)=>{
        if(err) console.log(err);
        else{
            image = JSON.parse(JSON.stringify(res));
            var enc = new TextDecoder("utf-8");
            var arr = new Uint8Array(image[0].image.data);
            image = enc.decode(arr); 
            let queryToGetTasks = `SELECT NotesTask FROM ${req.query.user} WHERE BoardName = '${req.query.noteBook}' `
            connection.query(queryToGetTasks,(err,res)=>{
        if(err) console.log(err);
        else{
            taskArr = res[0];
            
            taskArr=JSON.parse(JSON.stringify(taskArr));            
            taskArr =JSON.parse(taskArr.NotesTask);
            const obj = {
                taskArr:taskArr,
                image : image,
                cssPath : 'css/taskPage.css',
                jsPath : 'js/taskPage.js',
                logoPath : 'Asssets/logo.png',
            }
            response.render('taskPage',{obj});
        }
    })
        }
    })
})

app.post('/allNotes',(req,response)=>{
    let taskArr ;
    let queryToGetImage = `SELECT NotesTask FROM ${req.body.user} WHERE 1`;
    connection.query(queryToGetImage,(err,res)=>{
        if(err) console.log(err);
        else{
            
            taskArr= JSON.parse(JSON.stringify(res))
            taskArr.forEach((ele)=>{
                ele.NotesTask = JSON.parse(ele.NotesTask);
            })
            for(let i = 0 ; i<taskArr.length ; i++) { 
                 for(let j = 0 ; j<taskArr[i].NotesTask.length ; j++) { 
                    if(taskArr[i].NotesTask[j].taskName===req.body.taskName){
                        response.send(taskArr[i].NotesTask[j])
                    }
                 }
             }
        }
    });
})

app.get('/allNotes',(req,response)=>{
    let taskArr ;
    let image;
    let queryToGetImage = `SELECT image FROM UserInfo WHERE Id='${req.query.user}'`;
    connection.query(queryToGetImage,(err,res)=>{
        if(err) console.log(err);
        else{
            image = JSON.parse(JSON.stringify(res));
            var enc = new TextDecoder("utf-8");
            var arr = new Uint8Array(image[0].image.data);
            image = enc.decode(arr); 
            let queryToGetTasks = `SELECT NotesTask FROM ${req.query.user} WHERE true `
            connection.query(queryToGetTasks,(err,res)=>{
        if(err) console.log(err);
        else{
            taskArr = JSON.parse(JSON.stringify(res));
            
            taskArr.forEach(ele => {
                ele.NotesTask = JSON.parse(ele.NotesTask);
            })
            const obj = {
                taskArr:taskArr,
                image : image,
                cssPath : 'css/allNotes.css',
                jsPath : 'js/allNotes.js',
                logoPath : 'Asssets/logo.png',
            }
            response.render('allNotes',{obj})
        }
    })
        }
    });
})

app.listen(port,() => console.log(`listening to port ${port}`))