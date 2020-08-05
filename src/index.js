const fs = require('fs');
const ora = require('ora');
const clear = require('clear');
const inquirer = require('inquirer');
require('colors');
const homedir = require('os').homedir();
clear();
console.log(`Hello and Welcome to the Easy Rich Presence CLI!\n`.red);

inquirer
  .prompt([
    {
      name: 'Choice',
      type: 'list',
      choices: [
        'Start Rich Presence', 'Update RP Details',
      ],
    },
  ]).then((answers) => {
    switch (answers.Choice) {
      case 'Update RP Details':
        newPresence();
        break;
      case 'Start Rich Presence':
        oldPresence();
        break;
      default:
        break;
    }
  });
function oldPresence() {
  if (!fs.readdirSync(homedir).includes('.easy-rpc-config.json')) return newPresence();
  clear();
  const data = fs.readFileSync(`${homedir}/.easy-rpc-config.json`)
  const { state, details, clientID, imageKey } = JSON.parse(data);
  const client = require('discord-rich-presence')(clientID);
  client.updatePresence({
    state: state,
    details: details,
    largeImageKey: imageKey,
    instance: true,
  });
  console.log('Now Displaying your Custom Rich Presence!\nEnjoy!'.magenta);
}

function newPresence() {
  clear();
  console.log(`What would you like the state to be?`);
  inquirer.prompt([
    {
      name: 'State',
      type: 'input',
    },
    {
      name: 'Details',
      type: 'input',
    },
    {
      name: 'Client_ID',
      type: 'input',
    },
    {
      name: 'Image_Key',
      type: 'input',
    },
  ]).then((answers) => {
    fs.writeFileSync(`${homedir}/.easy-rpc-config.json`, JSON.stringify({ state: answers.State.trim(), details: answers.Details.trim(), clientID: answers.Client_ID.trim(), imageKey: answers.Image_Key.trim() }));
    oldPresence();
  });
}
