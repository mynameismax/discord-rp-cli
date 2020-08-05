#!/usr/bin/env node

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
  ]).then((ans) => {
    switch (ans.Choice) {
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
  ]).then((ans) => {
    let cID = ans.Client_ID;
    let imgKey = ans.Image_Key;
    let theState = ans.State;
    let theDetails = ans.Details;
    if (!ans.Client_ID) {
      cID = '740399215066218557';
      imgKey = 'invalid';
    }
    if (isNaN(ans.Client_ID.trim())) {
      cID = '740399215066218557';
      imgKey = 'invalid';
    }
    if (!ans.State) theState = 'No state provided.';
    if (!ans.Details) theDetails = 'No details provided.';

    fs.writeFileSync(`${homedir}/.easy-rpc-config.json`, JSON.stringify({ state: theState.trim(), details: theDetails.trim(), clientID: cID.trim(), imageKey: imgKey.trim() }));
    oldPresence();
  });
}
