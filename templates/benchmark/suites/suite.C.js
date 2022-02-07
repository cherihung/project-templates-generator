const processItem = require('./setups').processItem;

var globalQueue = [];

function *progressGenerator() {
  let index = 0;
  while(true) {
    yield ++index;
  }
}

async function populateQueueEach(data) {
  const currentProgress = progressGenerator();
  let currentCount;
   return data.map(async (d) => {
     try {
      const item = await processItem(d);
      globalQueue.push(item);
      currentCount = currentProgress.next().value;
      //console.log(`Progress: ${currentCount}/${data.length} added to queue.`)
      // logDB3.push(`Progress: ${currentCount}/${data.length} added to queue.`)
      return item;
     } catch(err) {
      console.error('error: ', err)
     }
   })
}

async function mainWithProgressSeparate({names}) {
  await populateQueueEach(names);
  // finally, output
  //console.log(globalQueue.length)
}

// (async () => {
//   await mainWithProgressSeparate()
// })()

module.exports = {
  executor: mainWithProgressSeparate,
  name: 'WithGeneratorTracker'
};