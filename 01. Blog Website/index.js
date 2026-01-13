import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
const blogStoragePath = '/media/eduardo/Seagate/Programming/Personal Projects/Personal_Projects/01. Blog Website/blogsStorage';

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    fs.readdir(blogStoragePath, (err, files) => {
        if(err) {
            console.error('Error reading directory:', err);
            return res.status(500).send("Server error");
        }
        const blogs = files.map(file => ({
            title: file.replace(/\.txt$/, ""),
            slug: file.replace(".txt", "")
        }));

        res.render('index.ejs', { blogs });
        });
    });

app.get("/new-post", (req, res) => {
    res.render('new-post.ejs');
});

app.post('/submit', (req, res) => {
    const blogName = req.body.blogName;
    const blogContent = req.body.content;
    fs.writeFile(`${blogStoragePath}/${blogName}.txt`, blogContent, (err) => {
        if(err) throw err;
        console.log('The file has been saved!');
    });
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});