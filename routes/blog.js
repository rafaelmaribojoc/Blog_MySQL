const express = require('express');
const router = express.Router();

const db = require('../data/database');

router.get('/', (req, res) => {
    res.redirect('/posts');
});

router.get('/posts', async (req, res) => {
    
    const query = `
    SELECT posts.*, authors.name 'author_name'
    FROM posts
    INNER JOIN authors 
    ON posts.author_id = authors.id`;

    try {
      const [ posts ] = await db.query(query);
      res.render('posts-list', { posts: posts });
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/posts/:id', async (req, res) => {
    const postID = req.params.id;
    const query = `
    SELECT posts.*, authors.name 'author_name', authors.email 'author_email' 
    FROM posts
    INNER JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = ?
    `;

    try {
        var [posts] = await db.query(query, [postID]);
    } catch (error) {
        console.log(error.message);
    }

    if (!posts || !posts.length) {
        return res.status(404).render('404');
    }

    const postData = {
        ...posts[0],
        date: posts[0].date.toISOString(),
        humanReadableDate: posts[0].date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    
    res.render('post-detail', { post: postData});

});

router.get('/posts/:id/edit', async (req, res) => {
    const postID = req.params.id;

    const query = 'SELECT * FROM posts WHERE posts.id = ?';

    try {
        var [posts] = await db.query(query, [postID]);
    } catch (error) {
        console.log(error.message);
    }

    // console.log(JSON.stringify(posts));

    res.render('update-post', {post: posts[0]});
});

router.post('/posts/:id/edit', async (req, res) => {
    const query = 'UPDATE posts SET title = ?, summary = ?, body = ? WHERE id = ?';
    const postID = req.params.id;
    const {title, summary, content} = req.body;

    // const data = [
    //     req.body.title,
    //     req.body.summary,
    //     req.body.content,
    //     req.body.author,
    //     req.params.id,
    // ];

    try {
        await db.query(query, [title, summary, content, postID]);
    } catch (error) {
        console.log(error.message);
        return res.status(500).render('505');
    }

    res.redirect('/posts');
});

router.get('/new-post', async (req, res) => {
    try {
        const [authors] = await db.query('SELECT * FROM authors'); //we are using array desctructoring here because we are only interested in the first array which is the 'author' array returned by the query function
        res.render('create-post', {authors: authors});
    } catch (error) {
        console.log(error.message);
        return res.status(500).render('505');
    }
});

router.post('/new-post', async (req, res) => {
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author,
    ];

    try {
        await db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?)', [data]); //the `?` is a placeholder for the future data and it will be replaced
    } catch (error) {
        console.log(error.message);
        return res.status(500).render('505');
    }

    res.redirect('/posts');
});

router.post('/posts/:id/delete', async (req, res) => {
    const postID = req.params.id;
    const query = 'DELETE FROM posts WHERE id =?';

    try {
        await db.query(query, [postID]);
    } catch (error) {
        console.log(error.message);
        return res.status(500).render('505');
    }

    res.redirect('/posts');
});

module.exports = router;