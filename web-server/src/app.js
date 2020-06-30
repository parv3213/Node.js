const path = require('path');
const express = require('express');
const hbs = require ('hbs');
const geocode = require ('./utils/geocode');
const weather = require ('./utils/weather');

const app = express();
const port = process.env.PORT || 3000;

//Define paths for express engine 
const publicDirectoryPath = path.join(__dirname,'../public') ;
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebar engine and view location
app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);

//set up static dir to serve 
app.use(express.static(publicDirectoryPath));

app.get('',(req,res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Parv'
    });
});

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About me',
        information: 'My name is Parv Garg, I am pursuing  BTech at ICFAI TECH HYD.\nI made this page following Andrew Mead on Udemy ',
        name: 'Parv'
    });
});

app.get('/help', (req,res) => {
    res.render('help', {
        helpText: 'For any help contact- Parv Garg at parv3213@gmail.com',
        title: 'Help',
        name: 'Parv'
    });
});

app.get('/weather', (req,res) => {
    const address = req.query.address;
    if (!address)
    {
        return res.send({error: 'Please provide an address query'});
    }
    geocode(address,(error, { lantitude, longitude, location } = {}) => {
        if (error){
            return res.send({error});
        }
        weather(lantitude, longitude, (error , data) => {
            if (error){
                return res.send({error});
            }
            // return res.send(chalk.green(`At ${chalk.underline(location)}, ${data}`));
            return res.send({
                forecast: data,
                location: location,
                address 
            });
        });
    });

});



app.get('/products',(req,res) => {
    if (!req.query.search)
    {
        return res.send({
            error: 'You must provide a search term'
        });
    }
    //console.log(req.query.search);
    res.send({
        products: []
    });
});

app.get('/help/*', (req,res) => {
    res.render('help404', {
        title: '404',
        notFoundText: 'The page does not exists!, Redirected to help page',
        name: 'Parv Garg'
    });
});

app.get('*', (req,res) => {
    res.render('Page404', {
        title: '404',
        notFoundText: 'The page does not exists!',
        name: 'Parv Garg'
    });
});

//app.com
//app.com/help
//app.com/about

app.listen(port, () => {
    console.log('Server is up on Port '+port);
}); 