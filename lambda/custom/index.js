/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const https = require('https');
const fetch = require('node-fetch');
const HOST = 'http://www.data.tc.gc.ca';
const PATH = '/v1.3/api/eng/vehicle-recall-database/recall';
const SUFFIX ='?format=json';
const COUNT ='/count';
const MAKENAME='/make-name/';
const MODELNAME ='/model-name/';
const YEARRANGE ='/year-range/';

fetch('http://healthycanadians.gc.ca/recall-alert-rappel-avis/api/recent/en')
.then(res=> res.json())
.then(json=> console.log(json));


const LookUpVehicleRecall = function(make,model,year) {
  httpsGet(make,model,year,(recallCount) => {
      // this.response.speak(`The current price is ${prices.USD.selling}`);
      // this.emit(':responseReady'); 
      console.log("inside httpsget")
      return recallCount;
  });
}

function httpsGet(make, model, year, callback) {

  // GET is a web service request that is fully defined by a URL string
  // Try GET in your browser:

  // Update these options with the details of the web service you would like to call
  var options = {
      host: HOST,
      path: PATH + MAKENAME + make.toLowerCase() + MODELNAME + model.toLowerCase() + YEARRANGE + year + '-' + year + COUNT + SUFFIX,
      method: 'GET',
  };

console.log("options: " +JSON.stringify(options));

  var req = https.request(options, res => {
      
      res.setEncoding('utf8');
      var returnData = "";

      res.on('data', chunk => {
          returnData = returnData + chunk;
      });

      res.on('end', () => {
          var jsonData = JSON.parse(returnData);
          // this will execute whatever function the caller defined,
          // and pass the data we received from the webservice call
          // to it. In your call back you'll need handle the data
          // and make Alexa speak.
          console.log("json data: "+jsonData);
          callback(jsonData);  
      });

  });
  req.end();
}

//console.log(LookUpVehicleRecall('Honda','Accord','2014'));

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
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SearchByVehicle';
      // && request.dialogState !== 'COMPLETED';

  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    let prompt = '';
    var speechText = 'Hello World!';

    var make = currentIntent.slots['Make'].value; 
    var model = currentIntent.slots['Model'].value; 
    var year = currentIntent.slots['Year'].value; 
    


    for (const slotName in currentIntent.slots) {
      //speechText+= currentIntent.slots[slotName].value;
      console.log(slotName)


      const currentSlot = currentIntent.slots[slotName];
        
      if(!currentIntent.slots[slotName].value)
      {
        prompt = `What ${currentSlot.name} is it?`;

        return handlerInput.responseBuilder
          .speak(prompt)
          .reprompt(prompt)
          .addElicitSlotDirective(currentSlot.name)
          .getResponse();
      }
      console.log(currentSlot);
    }

    speechText = "Okay, I'll be looking for ";
    speechText += make+ "," + model+ "," + year;
    var count = LookUpVehicleRecall(make,model,year);
    speechText="I found " + count + " recalls"; 
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();

    // return handlerInput.responseBuilder
    //   .addDelegateDirective(currentIntent)
    //   .getResponse();
  }
};


const SearchByVehicleIntentHandler = {
  canHandle(handlerInput) {
    console.log("inside search vehicle intent handler")
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SearchByVehicle';
  },
  handle(handlerInput) {
    const speechText = 'Hello World!';

        // console.log("inside vehicle handler");
        // // // delegate to Alexa to collect all the required slots
        // // let isTestingWithSimulator = true; //autofill slots when 
        // // //using simulator, dialog management is only supported with a device
        // let filledSlots = delegateSlotCollection.call(this);
        

    
        // if (!filledSlots) {
        //     return;
        // }

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};


// function delegateSlotCollection() {
//   console.log("inside delegate slot")
//   let updatedIntent = this.event.request.intent.dialogState;
//   if (this.event.request.intent.dialogState === "STARTED") {
//       this.emit(':delegate', updatedIntent);
//   } else if (this.event.request.intent.dialogState !== "COMPLETED") {
//       if(this.event.request.intent.slots.purpose.value) {
//           let prompt = "We have 3 gaming computers on the shelf. ";
//           prompt +=  "Two premium computers and one cheap one. Which would you like?";
//           let reprompt = "In stock, we have premium and cheap computers, which would you like?";
          
//           this.emit(':elicitSlot', 'budget', prompt, reprompt);                
//       } else {
//           this.emit(':delegate', updatedIntent);
//       }
//   } else {
//       // we have collected all of our slots! 
//       // time to return them
//       return updatedIntent 
//   }
//   return null;
// }


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
    // SearchByVehicleIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    InProgressSearchByVehicleIntentHandler 
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
