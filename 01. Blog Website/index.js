import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render('index.ejs');
});

app.get("/new-post", (req, res) => {
    res.render('new-post.ejs');
});

app.post("/submit", (req, res) => {
    const blogName = req.body.blogName;
    const blogContent = req.body.content;
    const blogStoragePath = '/media/eduardo/Seagate/Programming/Personal Projects/Personal_Projects/01. Blog Website/blogsStorage';
    fs.writeFile(`${blogStoragePath}/${blogName}.txt`, blogContent, (err) => {
        if(err) throw err;
        console.log('The file has been saved!');
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});