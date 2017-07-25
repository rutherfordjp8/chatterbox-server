var fs = require('fs');
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var messages = [];
objFormatter = function(string) {
  var objStr = '{"';
  for (var i = 0; i < string.length; i++) {
    if (string[i] === '=') {
      objStr += '":"';
    } else if (string[i] === '&') {
      objStr += '","';
    } else {
      objStr += string[i];
    }
      
  } 
  
  objStr += '", "objectId":"' + messages.length + '"}';
  return objStr;
};
var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // console.log(request);
  //console.log(messages);
  // The outgoing status.
  if (request.method === 'OPTIONS') {
    console.log('!OPTIONS');
    var headers = {};
      // IE8 does not allow domains to be specified, just the *
      // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Credentials'] = false;
    headers['Access-Control-Max-Age'] = '86400'; // 24 hours
    headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept';
    response.writeHead(200, headers);
    response.end();
  } else {
    //...other requests

    var headers = defaultCorsHeaders;

    headers['Content-Type'] = 'application/json';
    //function to turn message string into an object format 

    var statusCode;
    if (request.url !== '/classes/messages' && request.url !== '/?order=-createdAt' && request.url !== '/' || request.url === undefined) {
      statusCode = 404;
      console.log('*********** DENIED ************');
    } else if (request.method === 'GET') {
      statusCode = 200;
    
      
    } else if (request.method === 'POST') {
      statusCode = 201;
      
  
      var body = '';
      request.on('data', (chunk) => {
        console.log(chunk);
        body += chunk;
      });
      request.on('end', () => {
      // body = Buffer.concat(body).toString();
        console.log('Almost Complete Buffer: ' + body + ' Type of: ' + typeof body);
        if (body[0] !== '{') {
          body = objFormatter(body);
        }
        body = JSON.parse(body); 
        if (!body.hasOwnProperty('objectId')) {
          body['objectId'] = messages.length;
        }
        console.log('Completed Buffer: ' + JSON.stringify(body));
        
        messages.push(body);
        

        response.writeHead(statusCode, headers);

        response.end(JSON.stringify({results: messages}));
      // at this point, `body` has the entire request body stored in it as a string
      });




    // var storedMessage = Object.assign({}, request._postData);
    // messages.push(storedMessage);

    // console.log('*****Request: ' + JSON.stringify(request._postData));
    // console.log('*****storedMessage: ' + JSON.stringify(storedMessage));
    // console.log('*****MESSAGES*****' + JSON.stringify(messages));

    } else if (request.method === 'PUT') {
      statusCode = 201;
    } else if (request.method === 'DELETE') {
      statusCode = 201;
    } 
  
  // See the note below about CORS headers.
    var headers = defaultCorsHeaders;
  
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
    headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
    response.writeHead(statusCode, headers);

// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.
// console.log('*****MESSAGES*****' + JSON.stringify(messages));
    response.end(JSON.stringify({results: messages}));
  }     
};


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


module.exports.requestHandler = requestHandler;



