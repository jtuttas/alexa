var http = require('https');

exports.handler = (event, context, callback) => {
    try {

        if (event.session.new) {
            // New Session
            console.log("NEW SESSION")
        }

        switch (event.request.type) {

            case "LaunchRequest":
                // Launch Request
                console.log(`LAUNCH REQUEST`)
                context.succeed(
                        generateResponse(
                                buildSpeechletResponse("Willkommenn zur multi media berufsbildende Schule in Hannover", false),
                                {}
                        )
                        )
                break;

            case "IntentRequest":
                // Intent Request
                console.log(`INTENT REQUEST`)

                switch (event.request.intent.name) {
                    case "lieblingslehrer":
                        context.succeed(
                                generateResponse(
                                        buildSpeechletResponse(`ihr Lieblingslehrer ist Dr. Jörg Tuttas`, false),
                                        {}
                                ))
                        break;
                    case "schulleiter":
                        context.succeed(
                                generateResponse(
                                        buildSpeechletResponse(`Der Schulleiter heißt Herr Maiss`, false),
                                        {}
                                ))
                        break;
                    case "telefon":
                        context.succeed(
                                generateResponse(
                                        buildSpeechletResponse(`Die Schule erreichen Sie telefonisch über <say-as interpret-as="digits">051164619811</say-as>.`, false),
                                        {}
                                ))
                        break;
                    case "adresse":
                        context.succeed(
                                generateResponse(
                                        buildSpeechletResponse(`Sie finden die Schule am Expo PLaza 3 in Hannover`, false),
                                        {}
                                ))
                        break;
                    case "aufgaben":
                        callMoodle(event,false, 'core_calendar_get_action_events_by_timesort', function callback(data) {
                            var r = "Hier sind ihre aktuellen Aufgaben: <break time=\"500ms\"/>";
                            
                            if (!data || data.events.length == 0) {
                                r = "Sie haben aktuell keine Aufgaben";
                            }
                            for (i = 0; i < data.events.length; i++) {
                                var ts = new Date(data.events[i].timestart * 1000);
                                r += data.events[i].name.substr(0, data.events[i].name.length - 1) + " bis <say-as interpret-as=\"date\">" + ts.getDate() + "." + (ts.getMonth() + 1) + "." + ts.getFullYear() + "</say-as> im Kurs " + data.events[i].course.fullname + "<break time=\"500ms\"/>";
                                //console.log(ts);
                            }
                            context.succeed(
                                    generateResponse(
                                            buildSpeechletResponse(r, false),
                                            {}
                                    ))

                        }, function error(msg) {
                            context.succeed(
                                    generateResponse(
                                            buildSpeechletResponse(msg, false),
                                            {}
                                    ))
                        });

                        break;
                    case "kurse":
                        callMoodle(event,true, 'core_enrol_get_users_courses', function callback(data) {
                            var r = "Sie sind in folgenden Kursen <break time=\"500ms\"/>";
                            if (!data || data.length == 0) {
                                r = "Sie sind aktuell in keinen Kursen";
                            }
                            for (i = 0; i < data.length; i++) {
                                r += data[i].fullname + "<break time=\"500ms\"/>";
                                //console.log(ts);
                            }
                            context.succeed(
                                    generateResponse(
                                            buildSpeechletResponse(r, false),
                                            {}
                                    ))
                        }, function error(msg) {
                            context.succeed(
                                    generateResponse(
                                            buildSpeechletResponse(msg, false),
                                            {}
                                    ))
                        });

                        break;
                    case "nachrichten":

                        callMoodle(event,true, 'core_message_data_for_messagearea_conversations', function callback(data) {
                            var r = "Sie haben folgende Nachrichten <break time=\"500ms\"/>";
                                
                                if (!data || data.contacts.length == 0) {
                                    r = "Sie haben aktuell keine neuen Nachrichten.";
                                }
                                var found = false;
                                for (i = 0; i < data.contacts.length; i++) {
                                    if (!data.contacts[i].isread) {
                                        r += "Neue Nachricht von " + data.contacts[i].fullname + ".<break time=\"400ms\"/>" + data.contacts[i].lastmessage + "<break time=\"500ms\"/>";
                                        found = true;
                                    }
                                    //console.log(ts);
                                }
                                if (!found) {
                                    r = " Sie haben keine neuen Nachrichten.";
                                }
                                context.succeed(
                                        generateResponse(
                                                buildSpeechletResponse(r, false),
                                                {}
                                        ))
                        }, function error(msg) {
                            context.succeed(
                                    generateResponse(
                                            buildSpeechletResponse(msg, false),
                                            {}
                                    ))
                        });

                        break;
                    case "AMAZON.StopIntent":
                        context.succeed(
                                generateResponse(
                                        buildSpeechletResponse(`Auf wiedersehen, ich wünsche einen schönen Schultag`, true),
                                        {}
                                ))
                        break;
                    case 'Unhandled':
                        context.succeed(
                                generateResponse(
                                        buildSpeechletResponse(`Darauf habe ich leider keine Antwort!`, true),
                                        {}
                                ))
                        break;
                    default:
                        context.succeed(
                                generateResponse(
                                        buildSpeechletResponse(`Darauf habe ich keine Antwort`, false),
                                        {}
                                ))

                }

                break;

            case "SessionEndedRequest":
                // Session Ended Request
                console.log(`SESSION ENDED REQUEST`)
                context.succeed(
                        generateResponse(
                                buildSpeechletResponse(`Auf wiedersehen, ich wünsche einen schönen Schultag!`, true),
                                {}
                        ))
                break;

            default:
                context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

        }
    } catch (error) {
        context.fail(`Exception: ${error}`)
    }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

    return {
        outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + outputText + "</speak>"
        },
        shouldEndSession: shouldEndSession
    }

}

generateResponse = (speechletResponse, sessionAttributes) => {

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }

}

function callMoodle(alexaRequest,withid, wsfunction, callback, error) {
    var accessToken = alexaRequest.context.System.user.accessToken;
    var aarray = accessToken.split("@");
    var server = aarray[0];
    var path = aarray[1];
    var token = aarray[2];
    var userid = aarray[3];
    server = server.substr(server.indexOf("://") + 3);

    path += '/webservice/rest/server.php?wstoken=' + token + '&wsfunction=' + wsfunction + '&moodlewsrestformat=json';
    if (withid) {
        path+= '&userid=' + userid;
    }
    /*
     console.log("AccessToken="+accessToken);
     console.log("Server="+server);
     console.log("token="+token);
     console.log("path="+path);
     console.log("userid="+userid);
     */
    http.get({
        host: server,
        path: path
    }, function (response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            var data = JSON.parse(body);
            if (data.exception) {
                error("Ich konnte Sie nicht anmelden, bitte deaktivieren Sie den Skill in ihrer alexa App und aktivieren sie ihn erneut");
            } else {
                callback(data);
            }
        });
    });
}
