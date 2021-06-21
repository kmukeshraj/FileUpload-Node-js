const express = require('express');
const fileUpload = require('express-fileupload');
const { dirname } = require('path');
const path = require('path');


const app = express();

// Setting the view engine
app.set('view engine', 'ejs');

app.use(fileUpload(
    {
        useTempFiles: true,
        tempFileDir: path.join(__dirname, 'temp'),
        createParentPath: true, 
        limits: { fileSize: 2 * 1024 * 1024 },
    }
));

app.get('/', (async (req, res, next) => {
    res.render('index')
}))

// Route to handle single files
app.post('/single', async (req, res, next) => {
    try {
        const file = req.files.mFile;
        console.log('file', file);
        const fileName = new Date().getTime().toString() + path.extname(file.name);

        const savePath = path.join(__dirname, 'public', 'uploads', fileName);
        if (file.truncated) {
            throw new Error('File size is too big...');
        }
        await file.mv(savePath);
        res.redirect('/');

    } catch (error) {
        console.log(error)
        res.send('Error uploading file')
    }
})

// Route to handle Multiple files
app.post('/multi', async (req, res, next) => {
    try {
        const files = req.files.mFiles;
        let promises = [];
        files.forEach((file => {
            const savePath = path.join(__dirname, 'public', 'uploads', file.name);
            promises.push(file.mv(savePath));
        }))
        await Promise.all(promises)
        res.redirect('/');
    }
    catch (error) {
        console.log(error)
        res.send('Error uploading files')
    }
})

app.listen(3000, () => {
    console.log('Server Listening on Port  3000');
})