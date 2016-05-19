function calcShannonEnt(dataSet) {
  var numEntries = dataSet.length
  labbelCounts = {}
  dataSet.forEach(function(featVec) {
    currentLabel = featVec[featVec.length - 1]
    if ( Object.keys(labbelCounts).indexOf(currentLabel) == -1 ) {
      labbelCounts[currentLabel] = 0
    }
    labbelCounts[currentLabel] += 1
  })
  var shannonEnt = 0.0
  for ( key in labbelCounts) {
    var prob = parseFloat(labbelCounts[key]/numEntries)
    shannonEnt -= prob * Math.log2(prob)
  }
  return shannonEnt
}

function createDataSet() {
  var dataSet = [[1,1,'yes'], [1,1,'yes'], [1,0,'no'], [0,1,'no'], [0,1,'no']]
  var labels = ['no surfacing', 'flippers']
  return [dataSet, labels]
}

var dataSetLabel = createDataSet()

var dataSet = dataSetLabel[0]
var labels = dataSetLabel[1]

calcShannonEnt(dataSet)

function splitDataSet(dataSet, axis, value) {
  var retDataSet = []
  dataSet.forEach(function(featVec){
    if (featVec[axis] == value) {
      var cloneFeatVec = featVec.slice()
      cloneFeatVec.splice(axis, 1)
      retDataSet.push(cloneFeatVec)
    }
  })
  return retDataSet
}

splitDataSet(dataSet, 0, 1)

function chooseBestFeatureToSplit(dataSet) {
  var numFeatures = dataSet.length - 1
  var baseEntropy = calcShannonEnt(dataSet)
  var bestInfoGain = 0.0
  var bestFeature = -1
  for (var i = 0; i < numFeatures; i++) {
    var featList = dataSet.map(function(example) {return example[i]})
    var uniqueVals = new Set(featList)
    var newEntropy = 0.0
    uniqueVals.forEach(function(value) {
      var subDataSet = splitDataSet(dataSet, i, value)
      var prob = subDataSet.length/parseFloat(dataSet.length)
      newEntropy += prob * calcShannonEnt(subDataSet)
    })
    var infoGain = baseEntropy - newEntropy
    if (infoGain > bestInfoGain) {
      bestInfoGain = infoGain
      bestFeature = i
    }
  }
  return bestFeature
}

chooseBestFeatureToSplit(dataSet)

function majorityCnt(classList) {
  var classCount = {}
  classList.forEach(function(vote) {
    Object.keys(classCount).indexOf(vote) == -1 ? classCount[vote] = 0 : classCount[vote] += 1
  })
  var mostCountClass = ''
  var mostCount = 0
  for (list in classCount) {
    if (classCount[list] > mostCount) {
      mostCount = classList[list]
      mostCountClass = list
    }
  }
  return mostCountClass
}

Array.prototype.count = function(value) {
  var counts = {}
  this.forEach(function(x) { counts[x] = (counts[x] ||  0) + 1})
  return counts[value]
}

function createTree(dataSet, labels) {
  var classList = dataSet.map(function(example) {return example[example.length - 1]})
  if (classList.count(classList[0]) == classList.length) {
    return classList[0]
  }
  if (dataSet[0].length == 1) {
    return majorityCnt(classList)
  }
  var bestFeat = chooseBestFeatureToSplit(dataSet)
  var bestFeatLabel = labels[bestFeat]
  var myTree = {}
  myTree[bestFeatLabel] = {}
  labels.splice(bestFeat, 1)
  var featValues = dataSet.map(function(example) {return example[bestFeat]})
  var uniqueVals = new Set(featValues)
  uniqueVals.forEach(function(value) {
    var subLabels = labels
    myTree[bestFeatLabel][value] = createTree(splitDataSet(dataSet, bestFeat, value), subLabels)
  })
  return myTree
}


console.log(createTree(dataSet, labels))
