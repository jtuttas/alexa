/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var http = require('https');

// https://www.efa.de/efaws2/default/XML_DM_REQUEST?sessionID=0&requestID=0&language=de&useRealtime=1&coordOutputFormat=WGS84[DD.ddddd]&locationServerActive=1&mode=direct&dmLineSelectionAll=1&depType=STOPEVENTS&useAllStops=1&command=null&calcOneDirection=1&uuid=GVH_APP&type_dm=stop&name_dm=25001795&itdTime=1514&itdDate=20170731&mId=efa_uestra


var alexa = {
  "session": {
    "new": true,
    "sessionId": "SessionId.c36765fe-f69b-4263-8da3-8a3239abffaa",
    "application": {
      "applicationId": "amzn1.ask.skill.e8903af1-7fcb-4fe8-a03e-bdd750e8b014"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.AH2GE2AOBQNHBLE4WDAZO6U6VMGBJLNZJWC37S7HTNQ4HWPSLW2NYCJX77S7DJZP4Z36OMGSMZDHQHMFQXQRUFVBPH4JNL7B4BL3IO6P5DMOXZUGWKMAKSKEMF5PFGCRRWHU3CFZ2B4JKXC7DPKKJU33JSORXNNAP2FNXAFHTTQJSIMKTHPWHZZ4C35H4RMDPAVUVFJ776OK5GQ",
      "accessToken": "https://moodle.mm-bbs.de/moodle@211db76a2380fc51f8f040c9164ce3e4§5465"
    }
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.e4e80b11-84e1-424a-98a5-3bba82732db6",
    "intent": {
      "name": "aufgaben",
      "slots": {}
    },
    "locale": "de-DE",
    "timestamp": "2017-08-12T12:24:07Z"
  },
  "context": {
    "AudioPlayer": {
      "playerActivity": "IDLE"
    },
    "System": {
      "application": {
        "applicationId": "amzn1.ask.skill.e8903af1-7fcb-4fe8-a03e-bdd750e8b014"
      },
      "user": {
        "userId": "amzn1.ask.account.AH2GE2AOBQNHBLE4WDAZO6U6VMGBJLNZJWC37S7HTNQ4HWPSLW2NYCJX77S7DJZP4Z36OMGSMZDHQHMFQXQRUFVBPH4JNL7B4BL3IO6P5DMOXZUGWKMAKSKEMF5PFGCRRWHU3CFZ2B4JKXC7DPKKJU33JSORXNNAP2FNXAFHTTQJSIMKTHPWHZZ4C35H4RMDPAVUVFJ776OK5GQ",
        "accessToken": "https://moodle.mm-bbs.de@/moodle@211db76a2380fc51f8f040c9164ce3e4@5465"
      },
      "device": {
        "supportedInterfaces": {}
      }
    }
  },
  "version": "1.0"
};

var accessToken = alexa.context.System.user.accessToken;
var aarray = accessToken.split("@");
var server=aarray[0];
var path=aarray[1];
var token=aarray[2];
var userid=aarray[3];
server=server.substr(server.indexOf("://")+3);

path += '/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_enrol_get_users_courses&moodlewsrestformat=json&userid='+userid;

console.log("AccessToken="+accessToken);
console.log("Server="+server);
console.log("token="+token);
console.log("path="+path);
console.log("userid="+userid);



http.get({
    host: server,
    //path: '/moodle/webservice/rest/server.php?wstoken=211db76a2380fc51f8f040c9164ce3e4&wsfunction=core_calendar_get_action_events_by_timesort&moodlewsrestformat=json'
    //       /moodle/webservice/rest/server.php?wstoken=9d5beb1b7b2fb484270e74a5d5021c68&wsfunction=core_calendar_get_action_events_by_timesort&moodlewsrestformat=json
    path: path
}, function (response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        //console.log(body);
        var data = JSON.parse(body);
        for (i=0;i<data.length;i++) {
            console.log(data[i].fullname);
            //console.log(ts);
        }
    });
});

