const Eos = require('eosjs');
require('dotenv').config();
const eos = Eos({
    httpEndpoint:process.env.ENDPOINT,
    chainId:process.env.CHAIN_ID,
    keyProvider:process.env.ACTIVE_KEY
});

let contract = null;
eos.contract(process.env.ORACLE).then(x => {
    console.log('Contract bound');
    contract = x
}).catch(error => {
    console.error('Could not get a reference to the oracle contract: ', error);
    process.exit();
});

const trustee = process.env.ACCOUNT_NAME;
const options = { authorization:[`${trustee}@active`] };

function catchSetCode(state, payload, blockInfo, context){
    if(!contract) return;
    const account = payload.data.account;
    const code = payload.data.code;

    console.log(`Account ${account} set code to ${code.substr(0, 15)}${code.length ? '...' : ''}`)

    function toggle(remove = 0){ contract.add(account, trustee, remove, options); }

    if(code.length) toggle();   // Add code account
    else toggle(1);             // Remove code account
}

const updaters = [
    {
        actionType:'*::setcode',
        updater:catchSetCode
    },
]

module.exports = updaters