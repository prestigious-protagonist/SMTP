const express = require("express");
const {PORT} = require('./config/config.js')
const app = express();
const connectDB = require("./model/db.js");
const apiRoutes = require("./routes/index");
const bodyParser = require("body-parser")
const path = require("path")
const cors = require('cors');
app.use(express.static('public'))
app.use(bodyParser.json(bodyParser.json()));
app.use(bodyParser.urlencoded({extended: true}));
const corsOptions = {
    origin: '*',  // You can replace '*' with a specific URL (e.g., 'http://localhost:3000') to restrict the allowed origin.
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  };
  app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Serve index.html for any other routes (for single-page app routing)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/vite-project/dist', 'index.html'));

});
  
  // Use CORS middleware before your route handling
  app.use(cors(corsOptions));
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
const startServer = () => {
    app.use('/api',apiRoutes.router)

    app.listen(PORT,() => {
        connectDB()
        console.log(`On port ${PORT}`);
    })
}

startServer();