const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecst = require('./utils/forecast');
const app = express();
const port = process.env.PORT || 3000;

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handlebarsa engien and views locations
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to server
app.use(express.static(publicDirectoryPath));

app.get('/', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Sebastian Salas'
    })
})

app.get('/about', (req,res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Sebastián salas'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is my text help example',
        name: 'Sebastian Salas'
    })
})

app.get('/weather', (req,res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (err, { latitude, longitude, location} = {}) => {
        if(err){
            return res.send({error: err})
        }
        forecst(latitude, longitude, (err, forecastData) => {
            if(err){
                return res.send({ error: err})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })  
        })
    });


    // res.send({
    //     forecst: 'It is snowing',
    //     location: 'Philadelphia',
    //     address: req.query.address
    // });
});


app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.sesnd({
            error: 'You must provide a search term'
        });
    }
})

app.get('/help/*', (req,res) => {
    res.render('404',{
        title: '404',
        notfoundtext: 'Help article not found',
        name: 'Sebastian salas'
    })
})

app.get('*', (req, res) => {
    res.render('404',{
        title: '404',
        notfoundtext: 'Page not found',
        name: 'Sebastian salas'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});