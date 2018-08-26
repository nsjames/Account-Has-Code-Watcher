## Setup

- run `npm i`
- You will need to edit a file in the Demux package to support wildcards until my PR is merged.
    [See this commit](https://github.com/EOSIO/demux-js/pull/47/commits/a12f9e0a97ae5aad758921fe419d5982e09cb029) for more information or follow the steps below.
- Copy the `.env.sample` file to `.env` in the same path and fill it out with your parameters.
- run `npm start`



### Editing Demux to support wildcards.

- Find the `AbstractActionHandler.js` file in `node_modules/demux/dist/AbstractActionHandler.js` 
- Search for the `runUpdaters(state, block, context)` method
- Make it look like the following:

```js
runUpdaters(state, block, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { actions, blockInfo } = block;
        for (const action of actions) {
            for (const updater of this.updaters) {

                // Wildcard support ( *::transfer ) or ( eosio::* )
                const searchableTypes = [
                    action.type,
                    `*::${action.type.split('::')[1]}`,
                    `${action.type.split('::')[0]}::*`
                ];

                if (searchableTypes.includes(updater.actionType)) {
                    const { payload } = action;
                    yield updater.updater(state, payload, blockInfo, context);
                }
            }
        }
    });
}
```