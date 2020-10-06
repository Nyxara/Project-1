// Note this object is purely in memory
const users = {};

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
    
    if(!params.name) {
        return respondJSON(request, response, 200, responseJSON);
    } else if (params.name) {
        let yes = users[params.name];
        if(yes) {
            return respondJSON(request, response,200,{user:yes})
        } else {
            responseJSON.message = 'No user with this name';
    // give the error a consistent id
    responseJSON.id = 'notFound';
            return respondJSON(request, response,404,responseJSON)
        }
    }

  
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
