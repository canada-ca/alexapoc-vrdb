/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const https = require('https');
const fetch = require('node-fetch');
const util = require('util');
const HOST = 'http://data.tc.gc.ca';
const PATH = '/v1.3/api/eng/vehicle-recall-database/';
const RECALL = 'recall';
const SUFFIX = '?format=json';
const COUNT = '/count';
const MAKENAME = '/make-name/';
const MODELNAME = '/model-name/';
const YEARRANGE = '/year-range/';
const RECALLSUM = '/recall-summary/';
const RECALLNUMBER = '/recall-number/';





//'http://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall/make-name/honda/model-name/accord/year-range/2014-2014/count?format=json
async function GetVehicleRecallCount(make, model, year) {
  console.log("inside func");
  try {
    var url = HOST + PATH + RECALL + MAKENAME + make + MODELNAME + model + YEARRANGE + year + "-" + year + COUNT + SUFFIX;
    console.log(url);
    let res = await fetch(url)
    res = await res.json();
    console.log(util.inspect(res, { depth: null }));
    var count = res.ResultSet[0][0]['Value']['Literal'];
    console.log("returning: " + count);
    return count;

  } catch (error) {
    return 0;
  }

}

//todo fix, could return several recalls asscoiated to the vehicle
//'http://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall/make-name/honda/model-name/accord/year-range/2014-2014?format=json
async function GetRecallNumbers(make, model, year) {
  console.log("inside func");
  try {
    var url = HOST + PATH + RECALL + MAKENAME + make + MODELNAME + model + YEARRANGE + year + "-" + year + SUFFIX;
    console.log(url);
    let res = await fetch(url)
    res = await res.json();
    var recallList = [];
    console.log(util.inspect(res, { depth: null }));

    for (let index = 0; index < res.ResultSet.length; index++) {
      for (let y = 0; y < res.ResultSet[index].length; y++) {
        //const element = array[y];
        console.log(res.ResultSet[index][y]["Name"])
        if (res.ResultSet[index][y]["Name"] === "Recall number") {
          console.log("found targeted object in array");
          console.log("value found: " + res.ResultSet[index][y]["Value"]["Literal"]);
          recallList.push(res.ResultSet[index][y]["Value"]["Literal"]);
        }

      }
    }
    console.log(recallList)
    return recallList;

  } catch (error) {
    return 0;
  }

}



//http://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall-summary/recall-number/1977043?format=json
async function GetRecallDetails(recallNumber) {
  try {
    var url = HOST + PATH + RECALLSUM + RECALLNUMBER + recallNumber + SUFFIX;
    console.log(url)

    let res = await fetch(url);
    res = await res.json();
    var vehicleInfo=[];



    console.log(res);
    for (let index = 0; index < res.ResultSet.length; index++) {
      for (let y = 0; y < res.ResultSet[index].length; y++) {
        //const element = array[y];
        console.log(res.ResultSet[index][y]["SYSTEM_TYPE_ETXT"])
        if (res.ResultSet[index][y]["Name"] === "SYSTEM_TYPE_ETXT") {
          console.log("found targeted object in array");
          console.log(res.ResultSet[index][y]);

          console.log(res.ResultSet[index][y]["Value"]["Literal"]);
          //vehicleInfo.push(res.ResultSet[index][y]["Value"]["Literal"]);
          return res.ResultSet[index][y]["Value"]["Literal"];
          //console.log("value found: " + res.ResultSet[index][y]["Value"]["Literal"]);
        }

      }
    }


    //return vehicleInfo;

  } catch (error) {
    return 0;
  }

}
console.log("getting recall numbers");
//GetRecallNumbers("dodge", "charger", "2014");
//GetRecallDetails("2017327");


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const userOptions = " You can say search by vehicle";

    var speechText = 'Welcome to Transport Canada, I can inform you  about vehicle recalls.';
    speechText += userOptions;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(userOptions)
      .withSimpleCard('Search Options', "Search by vehicle")
      .getResponse();
  },
};


const InProgressSearchByVehicleIntentHandler = {
  canHandle(handlerInput) {
    console.log("dialog state: " + handlerInput.requestEnvelope.request.dialogState);
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SearchByVehicle'
      && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED';

  },
  async handle(handlerInput) {
    console.log("inside in progress handle")

    return handlerInput.responseBuilder
      .addDelegateDirective(handlerInput.requestEnvelope.request.intent) // makes alexa prompt for required slots.
      .getResponse();
  }
};

const CompletedSearchByVehicleIntentHandler = {
  canHandle(handlerInput) {
    console.log("dialog state: " + handlerInput.requestEnvelope.request.dialogState);
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SearchByVehicle'
      && handlerInput.requestEnvelope.request.dialogState === 'COMPLETED';

  },
  async handle(handlerInput) {
    console.log("inside in completed")
    const currentIntent = handlerInput.requestEnvelope.request.intent;

    var make = currentIntent.slots['Make'].value;
    var model = currentIntent.slots['Model'].value;
    var year = currentIntent.slots['Year'].value;

    var speechText = "Okay, I'll be looking for ";
    speechText += make + "," + model + "," + year;
    var count = await GetVehicleRecallCount(make, model, year);
    var components =[];

    if (count >= 1) {
      var recallNumbers = await GetRecallNumbers(make, model, year);
      //todo loop through all recall numbers

      for (let i = 0; i < recallNumbers.length; i++) {
        const targetedRecall = recallNumbers[i];
        var details = await GetRecallDetails(targetedRecall)
        components.push(details);
      }

    }

    speechText = "I found " + count + " recall" + (count > 1 ? "s" : "") +" related to the " + components.join() 
    + " component. You can say I want details on the " +components[0];
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Recalls Found', speechText)
      .getResponse();
  }
};






//REQUIRED ALEXA INTENTS

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    InProgressSearchByVehicleIntentHandler,
    CompletedSearchByVehicleIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
