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
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function constructWheelArray(tableArr) {
    console.log("TOP OF FUNCTION")
    console.log(tableArr)
    // console.log(tableArr)
    // console.log(tableArr)
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

    shuffleArray(allElements)
    return allElements
  }
