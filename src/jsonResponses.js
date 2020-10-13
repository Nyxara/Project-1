// Note this object is purely in memory
const users = {
    Zhaxi: {
        name: 'Zhaxi',
        level: '7',
        class: 'Sorcerer',
        race: 'Kitsune',
        campaign: 'Stormalong',
        ref: 'https://drive.google.com/file/d/1fO8BLl5saXls0sJXMQCKzskNFNa4Ojgs/view?usp=sharing',
        creator: 'Nyxara',
    },
    
    Azire: {
        name: 'Azire',
        level: '88',
        class: 'Rogue/Assassin',
        race: 'Tiefling',
        campaign: 'Stormalong',
        ref: 'https://docs.google.com/document/d/1Yz-M7V6JehmWOhDwXk4TjZj0riSgsrm2BCGokZrgcIk/edit?usp=sharing',
        creator: 'Evon',
    },
};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  // should add content-size:, last-modified: headers
  const headers = {
    'Content-Type': 'application/json',
    'X-num-users': Object.keys(users).length,
  };

  response.writeHead(status, headers);
  response.end();
};

const getUsers = (request, response, params) => {
// create a parent object to hold the users object
  // we could add a message, status code,...etc to this parent object
  const responseJSON = {
    users,
  };

  if (!params.name) {
    return respondJSON(request, response, 200, responseJSON);
  } if (params.name) {
    const yes = users[params.name];
    if (yes) {
      return respondJSON(request, response, 200, { user: yes });
    }
    responseJSON.message = 'No character with this name';
    // give the error a consistent id
    responseJSON.id = 'notFound';
    return respondJSON(request, response, 404, responseJSON);
  }

 /* if (!params.creator) {
    return respondJSON(request, response, 200, responseJSON);
  } if (params.creator) {
    const yese = users[params.creator];
    if (yese) {
      return respondJSON(request, response, 200, { user: yese });
    }
    responseJSON.message = 'No creators with this name';
    // give the error a consistent id
    responseJSON.id = 'notFound';
    return respondJSON(request, response, 404, responseJSON);
  }*/

  return responseJSON(request, response, 200, responseJSON, 'application/json');
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };

  if (!body.name || !body.level) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
    users[body.name].name = body.name;
  }

  users[body.name].level = body.level;
  users[body.name].class = body.class;
  users[body.name].race = body.race;
  users[body.name].campaign = body.campaign;
  users[body.name].ref = body.ref;
  users[body.name].creator = body.creator;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully!';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
  addUser,
};
