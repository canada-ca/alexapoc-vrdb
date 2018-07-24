/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

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

  
    


    for (const slotName in currentIntent.slots) {
      speechText+= currentIntent.slots[slotName].value;
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
      if (Object.prototype.hasOwnProperty.call(currentIntent.slots, slotName)) {
  
        // console.log(currentSlot.resolutions );
        // console.log(currentSlot.resolutions.resolutionsPerAuthority[0]);
        // console.log(currentSlot.resolutions.resolutionsPerAuthority[0].status.code );
        // console.log(currentSlot.resolutions.resolutionsPerAuthority[0].values.length  );
        // console.log(currentSlot.confirmationStatus );




        // // // // if (currentSlot.confirmationStatus !== 'CONFIRMED'){
        // // // //   // && currentSlot.resolutions
        // // // //   // && currentSlot.resolutions.resolutionsPerAuthority[0]) {
        // // // //   // if (currentSlot.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH') {
        // // // //     // if (currentSlot.resolutions.resolutionsPerAuthority[0].values.length > 1) {
        // // // //       prompt = 'Which would you like';
        // // // //       const size = currentSlot.resolutions.resolutionsPerAuthority[0].values.length;
        // // // //       speechText = "inside most inner if statement"

        // // // //       currentSlot.resolutions.resolutionsPerAuthority[0].values
        // // // //         .forEach((element, index) => {
        // // // //           prompt += ` ${(index === size - 1) ? ' or' : ' '} ${element.value.name}`;
        // // // //         });

        // // // //       prompt += '?';

        // // // //       return handlerInput.responseBuilder
        // // // //         .speak(prompt)
        // // // //         .reprompt(prompt)
        // // // //         .addElicitSlotDirective(currentSlot.name)
        // // // //         .getResponse();
        // // // //     // }
        // // // //   } else if (currentSlot.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_NO_MATCH') {
        // // // //     if (requiredSlots.indexOf(currentSlot.name) > -1) {
        // // // //       prompt = `What ${currentSlot.name} are you looking for`;

        // // // //       return handlerInput.responseBuilder
        // // // //         .speak(prompt)
        // // // //         .reprompt(prompt)
        // // // //         .addElicitSlotDirective(currentSlot.name)
        // // // //         .getResponse();
        // // // //     }
        // // // //   }
        // // // // }
      }
    }

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
