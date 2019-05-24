var app = require('../app');
const config = require('../config/environments');
require('dotenv').config();
var port = config.mysql.port;

app.listen(port, () => {
    console.log('Example app listening on port : ' + port) ;
});


