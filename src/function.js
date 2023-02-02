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
