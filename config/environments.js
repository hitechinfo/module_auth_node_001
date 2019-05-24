require('dotenv').config();

const environments = {
    development : {
      mysql: {
        port : process.env.localport
      }
    },


    production: {
      mysql: {
        port : process.env.port
      }
    }
}


const nodeEnv = process.env.node_env || 'development';

module.exports = environments[nodeEnv];
