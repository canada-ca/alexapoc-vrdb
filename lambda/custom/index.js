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
      //&& request.dialogState !== 'COMPLETED';

  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    let prompt = '';

    for (const slotName in currentIntent.slots) {
      if (Object.prototype.hasOwnProperty.call(currentIntent.slots, slotName)) {
        const currentSlot = currentIntent.slots[slotName];
        if (currentSlot.confirmationStatus !== 'CONFIRMED'
          && currentSlot.resolutions
          && currentSlot.resolutions.resolutionsPerAuthority[0]) {
          if (currentSlot.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH') {
            if (currentSlot.resolutions.resolutionsPerAuthority[0].values.length > 1) {
              prompt = 'Which would you like';
              const size = currentSlot.resolutions.resolutionsPerAuthority[0].values.length;

              currentSlot.resolutions.resolutionsPerAuthority[0].values
                .forEach((element, index) => {
                  prompt += ` ${(index === size - 1) ? ' or' : ' '} ${element.value.name}`;
                });

              prompt += '?';

              return handlerInput.responseBuilder
                .speak(prompt)
                .reprompt(prompt)
                .addElicitSlotDirective(currentSlot.name)
                .getResponse();
            }
          } else if (currentSlot.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_NO_MATCH') {
            if (requiredSlots.indexOf(currentSlot.name) > -1) {
              prompt = `What ${currentSlot.name} are you looking for`;

              return handlerInput.responseBuilder
                .speak(prompt)
                .reprompt(prompt)
                .addElicitSlotDirective(currentSlot.name)
                .getResponse();
            }
          }
        }
      }
    }

    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  },
};


const SearchByVehicleIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SearchByVehicle'
      && request.dialogState === 'COMPLETED';

  },
  handle(handlerInput) {
    const speechText = 'Hello World!';

        console.log("inside vehicle handler");
        // // delegate to Alexa to collect all the required slots
        // let isTestingWithSimulator = true; //autofill slots when 
        // //using simulator, dialog management is only supported with a device
        //let filledSlots = delegateSlotCollection.call(this);
        

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

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
    SearchByVehicleIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    InProgressSearchByVehicleIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
