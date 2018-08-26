const { BaseActionWatcher } = require("demux");
const { NodeosActionReader } = require("demux-eos");
const ObjectActionHandler = require("./ObjectActionHandler");
const updaters = require("./updaters");
require('dotenv').config();

function throwAndExit(msg){
    console.error(msg);
    process.exit();
}

const requiredEnvVars = [ 'ORACLE', 'ENDPOINT', 'CHAIN_ID', 'ACTIVE_KEY', 'ACCOUNT_NAME' ];
requiredEnvVars.map(function(key){
    if(!process.env[key] || !process.env[key].length)
        return throwAndExit(`You must specify the ${key} in the .env file`);
});

const actionHandler = new ObjectActionHandler( updaters, [], );
const actionReader = new NodeosActionReader( process.env.ENDPOINT, 0, );
const actionWatcher = new BaseActionWatcher( actionReader, actionHandler, 500, );
actionWatcher.watch();