const handlebars = require('express-handlebars');
// Require Libraries
const express = require('express');
const fetch = require("node-fetch");
// App Setup
const app = express();
app.use(express.static('public'));

const Tenor = require("tenorjs").client({
  // Replace with your own key
  "Key": "AIzaSyC3kAnkJaSl_OWLOTIxwQL0NRBUuept5Ic", // https://tenor.com/developer/keyregistration
  "Filter": "high", // "off", "low", "medium", "high", not case sensitive
  "Locale": "en_US", // Your locale here, case-sensitivity depends on input
});

// Middleware
//allow Express (our web framework) to render HTML templates and send them back to the client using a new function

const hbs = handlebars.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo() { return 'FOO!'; },
        bar() { return 'BAR!'; }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

//routes
app.get('/', (req, res) => {

    if(req.query.term === '') { 
        console.log('nothing')
        res.render('home')
    }else{
        term = req.query.term
        fetch(`https://tenor.googleapis.com/v2/search?key=AIzaSyC3kAnkJaSl_OWLOTIxwQL0NRBUuept5Ic&q=${term}&limit=10`).then(res => {
            return res.json();
        }).then(data => {
            console.log(data.results);
            const gifs = data.results;
            res.render('home', { gifs })
        }).catch(error => console.log(error))
    }
})

// Start Server

//tells the app to log a message on port 3000. Once we start the server, we should see that message in the terminal 
app.listen(3000, () => {
    console.log('Gif Search listening on port localhost:3000!');
});