import express from "express"; // import express js
import bodyParser from 'body-parser'; // import middleware body parser
import { render } from "ejs";

//define varieable app to contain function express
const app = express();
const port = 3000; // define var containe port 3000

// use Body parser middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


let title = []; // let tiitle for contain title of block
let content = []; // let content for contain  content of block

let editTitle = "";
let editContent = "";
// path root render index js
app.get("/", (req,res)=>{
    res.render("index.ejs");
});

//path home

app.get("/home", (req,res)=>{
    res.render("home.ejs",{ // render home ejs
        content: content, // send var content to ejs for use
        title: title // send var title to ejs for use
        });
});

app.get("/detail", (req,res)=>{
    res.render("detail.ejs");
});

//path submit
app.post("/submit", (req,res)=>{
    var data = req.body; // data to contain data of form (title and content)
    console.log(data); // log data title and content
    
    title.push(data.title); // save title of form in var title
    content.push(data.content);// save title of from in var content
    console.log(title); // log title for test 
    res.render("submit.ejs") //render submit js
});

app.post("/editsuccess", (req,res)=>{
   console.log(req.body); 
   console.log(title);
   console.log(content);

   const data = req.body;
   const index = title.indexOf(editTitle);

   if(!(data.title === editTitle) && !(data.content === editContent)){
        title[index] = data.title;
        content[index] = data.content;
   }else if((!(data.title === editTitle) && (data.content === editContent))){
        title[index] = data.title;
   }else if(((data.title === editTitle) && !(data.content === editContent))){
        content[index] = data.content;
   }

   console.log("new title : " + title);
   console.log("new content : " + content);

   res.render("editsuccess.ejs");


});

// post method path home for show every title in my block
app.post("/home", (req, res) => {
    res.render("home.ejs",{ // render home ejs
    content: content, // send var content to ejs for use
    title: title // send var title to ejs for use
    });
});

app.post("/edit/:title", (req, res) =>{
    const titleParam = req.params.title;
    const index = title.indexOf(titleParam);

    const contentItem = content[index];
    editTitle = titleParam;
    editContent = contentItem;
    res.render("edit.ejs",{
        title : titleParam, 
        content : contentItem
    });


});


app.get("/detail/:title", (req, res) => {
    const titleParam = req.params.title;
    const index = title.indexOf(titleParam);

    const contentItem = content[index];


    res.render("detail.ejs",{
        title : titleParam,
        content : contentItem,
        navber:"partials/navbar.ejs"
        , header:"header.ejs"
    });

    
});

app.get("/delete/:title", (req, res) => {
    // 1. Extract the title parameter safely
    const titleParam = req.params.title;
    const index = title.indexOf(titleParam);
  
    if (!titleParam) {
      return res.status(400).send("Missing required parameter: 'title'");
    }
  
    // 2. Locate the content item by title efficiently
    const contentItemIndex = content[index];
  
    // 3. Check if the content item exists before deletion
    if (contentItemIndex === -1) {
      return res.status(404).send(`Content item with title '${titleParam}' not found`);
    }
    content.splice(index, index+1);
    title.splice(index, index+1);
  
    // 5. Send a success response
    // res.send(`Content item '${titleParam}' deleted successfully`);
    res.render("home.ejs",{
        title: title,
        content: content
    });
    console.log(title);
    console.log(content);
  });


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
