import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const blogStoragePath = __dirname + '/blogsStorage';

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    fs.readdir(blogStoragePath, (err, files) => {
        if(err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Server error');
        }
        const blogs = files.map(file => ({
            title: file.replace(/\.txt$/, ''),
            slug: file.replace('.txt', '')
        }));

        res.render('index.ejs', { blogs });
        });
    });

app.get('/new-post', (req, res) => {
    res.render('new-post.ejs');
});

app.get('/about', (req, res) => {
    res.render('about.ejs');
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

app.get('/blogsStorage/:slug', (req, res) => {
    const slug = req.params.slug;

    fs.readFile(blogStoragePath + '/' + slug + '.txt', 'utf-8', (err, content) => {
        if(err) {
            return res.status(404).send('Blog not found');
        }
        res.render('postedBlog.ejs', {
            title: slug,
            content
        });
    });
});

app.get('/edit/blogsStorage/:slug', (req, res) => {
    const slug = req.params.slug;

    fs.readFile(blogStoragePath + '/' + slug + '.txt', 'utf-8', (err, content) => {
        if(err) {
            return res.status(404).send('Blog not found');
        }
        res.render('editPost.ejs', {
            title: slug,
            content
        });
    });
});

app.post('/delete/blogsStorage/:slug', (req, res) => {
    const slug = req.params.slug;
    fs.unlink(blogStoragePath + '/' + slug + '.txt', (err) => {
        if(err) {
            console.error('Error deleting the file: ', err);
        } else {
            console.log('File deleted successfully');
            res.redirect('/');
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});