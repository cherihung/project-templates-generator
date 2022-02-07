const processItem = require('./setups').processItem;

var globalQueue = [];

async function* populateQueueEachWithProgress(data) {
  let success = 0;
   const result = data.map(async (d) => {
     try {
      const item = await processItem(d);
      return item;
     } catch(err) {
      console.error('error: ', err)
     }
   })
   for await(const r of result) {
      if(r) {
        globalQueue.push(r);
        ++success;
      }
   }
   yield success;
}

// async function mainWithProgressGenerator() {
//   for await (const currentCount of populateQueueEachWithProgress(names)) {
//     console.log(`Progress: ${currentCount}/${names.length} added to queue.`)
//     // logDB2.push(`Progress: ${currentCount}/${names.length} added to queue.`)
//   }
//   // finally, output
//   console.log(globalQueue.length)
// }
async function mainWithProgressGenerator({names}) {
  const concurrency = 20;
  let currentCount = 0;
  for(let i = 0; i < names.length; i+=concurrency) {
    for await(const chunkCount of populateQueueEachWithProgress(names.slice(i, i+concurrency))) {
      currentCount = currentCount + chunkCount;
      // console.log(`Progress: ${currentCount}/${names.length} added to queue.`)
      // logDB2.push(`Progress: ${currentCount}/${names.length} added to queue.`)
    }
  }
  // finally, output
  //console.log('b', globalQueue.length)
}

// (async () => {
//   await mainWithProgressGenerator()
// })()

module.exports = {
  executor: mainWithProgressGenerator,
  name: 'WithAsyncGenerator',
};