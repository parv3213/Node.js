const chalk = require ('chalk')
const geocode = require ('./utils/geocode');
const weather = require ('./utils/weather');

const address = process.argv[2];
if (address === undefined){
    return console.log(chalk.bgRed('Please specify an address!!'));
}
geocode(address,(error, { lantitude, longitude, location }) => {
    if (error){
        return console.log(`${chalk.red('Error:')}${error}`);
    }
    weather(lantitude, longitude, (error , data) => {
        if (error){
            return console.log(`${chalk.red('Error:')}${error}`);
        }
        console.log(chalk.green(`At ${chalk.underline(location)}, ${data}`));
    });
});