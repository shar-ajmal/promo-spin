/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// Import the necessary modules from Firebase Functions v2 and Firebase Admin SDK
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require('cors')({origin: true}); // Enable CORS for all requests
const logger = require("firebase-functions/logger");
require("firebase-functions/logger/compat");


// Initialize Firebase Admin SDK to access Firestore
admin.initializeApp();

// Define the Cloud Function using the new syntax
exports.checkEmailForGame = onRequest( (req, res) => {
    console.log("Function triggered");
    // functions.logger.log('hello world')

     cors(req, res, async () => {
        // Ensure the request is a POST request with the required parameters
        // console.log("we're in it")

        if (req.method !== "POST") {
            res.status(400).send("Please send a POST request with email and gameId.");
            return;
        }


        // Extract email and gameId from the request body
        const { email, gameId } = req.body.data;
        if (!email || !gameId) {
            res.status(400).send("Missing email or gameId.");
            return;
        }

        console.log("inside cloud function")
        console.log(req.body)
        console.log(email)
        console.log(gameId)
        // const responseData = { exists: false }; // Your actual response logic here
        // res.status(200).send({ data: responseData });

        try {
            // Reference to the collection where game entries are stored
            const infoCollectionRef = admin.firestore().collection("collected_info");

            // Query the database for the specific game ID and email
            console.log("inside the cloud function")
            console.log(gameId)
            console.log(email)
            const querySnapshot = await infoCollectionRef
            .where("game_id", "==", gameId)
            .where("email", "==", email)
            .get();

            if (!querySnapshot.empty) {
            // Email exists for the specified game
            const responseData = { exists: true }; 
            res.status(200).send({ data: responseData });
            } else {
            // Email does not exist for the specified game
            const responseData = { exists: false }; 

            res.status(200).send({ data: responseData });
            }
        } catch (error) {
            logger.error("Error checking email:", error);
            res.status(500).send("Error checking email.");
        }
    })
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
