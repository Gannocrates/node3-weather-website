const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

// Start Express
const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set Express handlebars integration
app.set('view engine', 'hbs')

// Set custom views and partials directories for handlebars
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Set up static directory from where content is served
app.use(express.static(publicDirectoryPath))

// Set up route to homepage (index.hbs)
app.get('', (req, res) => {
    res.render('index', {
        title: 'NodeJS',
        name: 'Doge'
    })
})

// Set up route to About page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Doge'
    })
})

// Set up route to Help page
app.get('/help', (req, res) => {
    res.render('help', {
        message: 'Help message',
        title: 'Help',
        name: 'Doge'
    })
})

// Set up route to Weather page
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
          return res.send({ error })
        }
      
        forecast(latitude,longitude, (error, forecastData) => {
          if (error) {
            res.send({ error })
          }
      
          res.send({
            forecast: forecastData,
            location,
            address: req.query.address

          })
        })
    })
})

// 
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

//
app.get('/help/*', (req, res) => {
    res.render('404', {
        name: 'Dogey',
        errorMessage: 'Cannot find Help page'
    })
})

// Set up route for 404
app.get('*', (req, res) => {
    res.render('404', {
        name: 'Dogey',
        errorMessage: 'Cannot find page'
    })
})

// Start the server on port 3000
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

