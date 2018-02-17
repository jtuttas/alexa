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
                console.log(`LAUNCH REQUEST`);
                if (event.session.user.accessToken == undefined) {
                    context.succeed(
                        generateResponse(
                            buildLinkedSpeechletResponse(`Du kannst diesen Skill nur verwenden, wenn Du in die Alexa App gehst und Dein Konto mit deinen Anmeldedaten verknüpfst und die Einrichtung abschließt.`, true),
                            {}
                        ))
                }
                else {
                    context.succeed(
                        generateResponse(
                            buildSpeechletResponse("Willkommenn zur multi media berufsbildende Schule in Hannover", false),
                            {}
                        )
                    )
                }
                break;

            case "IntentRequest":
                // Intent Request
                console.log(`INTENT REQUEST name=:` + event.request.intent.name + ' accessToken=' + event.session.user.accessToken);

                if (event.session.user.accessToken == undefined) {
                    context.succeed(
                        generateResponse(
                            buildLinkedSpeechletResponse(`Du kannst diesen Skill nur verwenden, wenn Du in die Alexa App gehst und Dein Konto mit deinen Anmeldedaten verknüpfst und die Einrichtung abschließt.`, true),
                            {}
                        ))
                }
                else {
                    switch (event.request.intent.name) {
                        case "lieblingslehrer":
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse(`ihr Lieblingslehrer ist Dr. Jörg Tuttas`, true),
                                    {}
                                ))
                            break;
                        case "schulleiter":
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse(`Der Schulleiter heißt Herr Maiss`, true),
                                    {}
                                ))
                            break;
                        case "telefon":
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse(`Die Schule erreichen Sie telefonisch über <say-as interpret-as="digits">051164619811</say-as>.`, true),
                                    {}
                                ))
                            break;
                        case "adresse":
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse(`Sie finden die Schule am Expo PLaza 3 in Hannover`, true),
                                    {}
                                ))
                            break;
                        case "aufgaben":
                            callMoodle(event, false, 'core_calendar_get_action_events_by_timesort', function callback(data) {
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
                                        buildSpeechletResponse(r, true),
                                        {}
                                    ))

                            }, function error(msg) {
                                context.succeed(
                                    generateResponse(
                                        buildSpeechletResponse(msg, true),
                                        {}
                                    ))
                            });

                            break;
                        case "kurse":
                            callMoodle(event, true, 'core_enrol_get_users_courses', function callback(data) {
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
                                        buildSpeechletResponse(r, true),
                                        {}
                                    ))
                            }, function error(msg) {
                                context.succeed(
                                    generateResponse(
                                        buildSpeechletResponse(msg, true),
                                        {}
                                    ))
                            });

                            break;
                        case "nachrichten":

                            callMoodle(event, true, 'core_message_data_for_messagearea_conversations', function callback(data) {
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
                                        buildSpeechletResponse(r, true),
                                        {}
                                    ))
                            }, function error(msg) {
                                context.succeed(
                                    generateResponse(
                                        buildSpeechletResponse(msg, true),
                                        {}
                                    ))
                            });

                            break;
                        case "AMAZON.CancelIntent":
                        case "AMAZON.StopIntent":
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse(`Auf wiedersehen, ich wünsche einen schönen Schultag`, true),
                                    {}
                                ))
                            break;
                        case "AMAZON.HelpIntent":
                            context.succeed(
                                generateResponse(
                                    buildSpeechletResponse(`Du kannst Deine aktuellen Aufgaben aus dem Moodle System abfragen, sage hierzu, wie sind meine Aufgaben? Oder in welchen Kursen du bist, sage hierzu, in in welchen Kursen bin ich? Oder aber auch welche Nachrichten Du im System hast, sage hierzu, habe ich neue Nachrichten?. Was möchtest Du tun?`, false),
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
                                    buildSpeechletResponse(`Darauf habe ich keine Antwort`, true),
                                    {}
                                ))

                    }
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

// Helpers
buildLinkedSpeechletResponse = (outputText, shouldEndSession) => {

    return {
        outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + outputText + "</speak>"
        },
        shouldEndSession: shouldEndSession,
        card: {
            type: "LinkAccount"
        }
    }

}

generateResponse = (speechletResponse, sessionAttributes) => {

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }

}




/**
 * 
 * @param {type} alexaRequest JSON von Alexa
 * @param {type} withid boolean, true=Moodle Abfrage mit userid
 * @param {type} wsfunction aufzurufenden Moodle Methode
 * @param {type} callback Callback bei Erfolg
 * @param {type} error Fehlerbehandlung
 */
function callMoodle(alexaRequest, withid, wsfunction, callback, error) {
    var accessToken = alexaRequest.context.System.user.accessToken;
    var aarray = accessToken.split("@");
    var server = aarray[0];
    var path = aarray[1];
    var token = aarray[2];
    var userid = aarray[3];
    server = server.substr(server.indexOf("://") + 3);

    switch (wsfunction) {
        case 'core_calendar_get_action_events_by_timesort':
            var date = new Date();
            var dvalue = "" + date.getTime() / 1000;
            dvalue = dvalue.substr(0, dvalue.indexOf("."));
            console.log("value=" + dvalue);

            path += '/webservice/rest/server.php?wstoken=' + token + '&wsfunction=' + wsfunction + '&moodlewsrestformat=json&timesortfrom=' + dvalue;
            break;
        default:
            path += '/webservice/rest/server.php?wstoken=' + token + '&wsfunction=' + wsfunction + '&moodlewsrestformat=json';

    }

    // console.log(path);
    if (withid) {
        path += '&userid=' + userid;
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
            }
            else {
                callback(data);
            }
        });
    });
}