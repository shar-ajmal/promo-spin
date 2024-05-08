import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase-config";
// Function to return gcd of a and b
export function gcd(a, b) {
    if (a == 0)
        return b;
    return gcd(b % a, a);
}

// Function to find gcd of array
// of numbers
export function findGCD(arr, n) {
    let result = arr[0];
    for (let i = 1; i < n; i++) {
        result = gcd(arr[i], result);

        if (result == 1) {
            return 1;
        }
    }
    return result;
}

const functions = getFunctions(app); // Pass the Firebase app instance if not using the default app

export const checkEmailForGame = httpsCallable(functions, 'checkEmailForGame');
  

export function validEntries(tableValues) {
    var probSum = 0
    for (var i=0;i<tableValues.length;i++) {
        if (tableValues[i]['name'] == "" || tableValues[i]['probability'] == "") {
            alert("No fields can be empty!")
            return false
        }
        console.log("testing prob")
        console.log(parseInt(tableValues[i]['probability']))
        console.log(parseInt(tableValues[i]['probability']) % 10)
        let probValue = parseInt(tableValues[i]['probability'])

        if(probValue % 5 != 0) {
            alert("Probabilities need to be divisible by 5!")
            return false
        }

        console.log(tableValues[i])
        console.log(tableValues[i]['probability'])
        probSum += parseInt(tableValues[i]['probability'])
    }

    console.log("probsum")
    console.log(probSum)
    if (probSum != 100) {
        alert("Probabilities need to equal 100!")
        return false
    }

    return true
}

export function createAlternatingArrayWithDuplicates(values, desiredLength = 10) {
    console.log("in the creation of a random array")
    // Filter out only strings and remove duplicates
    const uniqueStrings = Array.from(new Set(values.filter(value => typeof value === 'string')));

    // Ensure there are enough unique strings to avoid repeating the first and tenth item
    if (uniqueStrings.length < 2 && desiredLength >= 10) {
        throw new Error("Not enough unique strings to ensure the first and tenth items are different.");
    }
  
    // Initialize the alternating array
    let alternatingArray = [];
  
    // Fill the alternating array up to the desired length
    while (alternatingArray.length < desiredLength) {
        uniqueStrings.forEach(string => {
            // Check if adding this string would repeat the first item as the tenth
            if (alternatingArray.length === 9 && string === alternatingArray[0]) {
                // Find an alternative string to avoid repetition
                const alternativeString = uniqueStrings.find(s => s !== string);
                if (alternativeString) {
                    alternatingArray.push(alternativeString);
                }
                // Skip adding if no alternative is found; assumes there are at least 2 unique strings
            } else if (alternatingArray.length < desiredLength) {
                alternatingArray.push(string);
            }
        });
    }

    console.log("printing alternating array")
    console.log(alternatingArray)
  
    return alternatingArray;
}



export function shuffleArray(array) {
    let valueDict = {}
    for (let i=0; i < array.length; i++) {
        if (array[i] in valueDict) {
            valueDict[array[i]] += 1;
        }
        else {
            valueDict[array[i]] = 1;
        }
    } 

    let valueArr = []
    for(var key in valueDict) {
        valueArr.push({'name': key, 'numTimes': valueDict[key]})
    }

    let helixArr = []
    let valCount = 0
    console.log("looking at valArr")
    console.log(valueArr)
    console.log(valueDict)
    while (valueArr.length > 0) {
        console.log('HERE6')
        console.log(valueArr[valCount])
        if (valueArr[valCount]['numTimes'] == 0) {
            console.log("DELETING")
            console.log(valCount)
            // console.log(valueArr.splice(valCount,1))
            valueArr.splice(valCount,1)
            console.log(valueArr)
            valueArr.forEach(element => {
               console.log(element) 
            });
            if (valCount > (valueArr.length-1)) {
                valCount = 0;
            }
        }
        else {
            helixArr.push(valueArr[valCount]['name'])
            valueArr[valCount]['numTimes'] -= 1;
            if (valCount >= (valueArr.length-1)) {
                valCount = 0;
            }
            else {
                valCount += 1;
            }
        }
    }

    console.log("In shuffle array")
    console.log(helixArr)

    return helixArr
    // for (let i = array.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [array[i], array[j]] = [array[j], array[i]];
    // }
}

export function constructWheelArray(tableArr) {
    console.log("TOP OF FUNCTION")
    console.log(tableArr)
    var probArray = []
    var entryArray = []
    
    //creating the probability and name array
    for (var i=0; i<tableArr.length; i++) {
      probArray.push(tableArr[i]['probability'])
      entryArray.push(tableArr[i]['name'])
    }

    //find gcd
    var probGCD = findGCD(probArray, probArray.length)
    var allElements = []

    //algorithm to construct array based on gcd
    for (var i = 0; i < probArray.length; i++) {
        var numEl = probArray[i]/probGCD
        for (var j = 0; j < numEl; j++) {
            allElements.push(entryArray[i])
        }
    }

    return shuffleArray(allElements)
  }
