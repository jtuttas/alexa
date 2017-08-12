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
                                        buildSpeechletResponse(`Die Schule erreichen Sie telefonisch über 051164619811`, false),
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
                        var alexa = event;
                        var accessToken = alexa.context.System.user.accessToken;
                        var aarray = accessToken.split("@");
                        var server = aarray[0];
                        var path = aarray[1];
                        var token = aarray[2];
                        var userid = aarray[3];
                        server = server.substr(server.indexOf("://") + 3);

                        path += '/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_calendar_get_action_events_by_timesort&moodlewsrestformat=json';

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
                                var r = "Hier sind ihre aktuellen Aufgaben: <break time=\"500ms\"/>";
                                var data = JSON.parse(body);
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
                            });
                        });
                        break;
                    case "kurse":
                        var alexa = event;
                        var accessToken = alexa.context.System.user.accessToken;
                        var aarray = accessToken.split("@");
                        var server = aarray[0];
                        var path = aarray[1];
                        var token = aarray[2];
                        var userid = aarray[3];
                        server = server.substr(server.indexOf("://") + 3);

                        path += '/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_enrol_get_users_courses&moodlewsrestformat=json&userid='+userid;

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
                                var r = "Sie sind in folgenden Kursen <break time=\"500ms\"/>";
                                var data = JSON.parse(body);
                                if (!data || data.length == 0) {
                                    r = "Sie sind aktuell in keinen Kursen";
                                }
                                for (i = 0; i < data.length; i++) {
                                    r += data[i].fullname+"<break time=\"500ms\"/>";
                                    //console.log(ts);
                                }
                                context.succeed(
                                        generateResponse(
                                                buildSpeechletResponse(r, true),
                                                {}
                                        ))
                            });
                        });
                        break;
                    case "AMAZON.StopIntent":
                        context.succeed(
                                generateResponse(
                                        buildSpeechletResponse(`Auf wiedersehen, ich wünsche einen schönen Schultag`, true),
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
            type: "PlainText",
            text: outputText
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