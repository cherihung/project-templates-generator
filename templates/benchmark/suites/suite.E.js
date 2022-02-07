
const processItem = require('./setups').processItem;

var globalQueue = [];

// regular progress tracker
const reportProgress = (result, prevCount) => {
  if (result) {
    let success = result.filter(r => r.status === 'fulfilled');
		return prevCount + success.length;
	}
}

// process addition in batch
const populateQueueSome = async(data) => {
  const result = await Promise.allSettled(
   data.map(async (d) => {
     const item = await processItem(d);
     globalQueue.push(item);
     return item;
   })
 );
 return result;
}

async function mainWithProgress({names}) {
  const concurrency = 20;
  let currentCount = 0;
  for(let i = 0; i < names.length; i+=concurrency) {
    const result = await populateQueueSome(names.slice(i, i+concurrency));
    currentCount = reportProgress(result, currentCount);
    //console.log(`Progress: ${currentCount}/${names.length} added to queue.`)
  }
  // finally, output
  //console.log('a', globalQueue.length)
}

// (async () => {
//   await mainWithProgress()
// })()

module.exports = {
  executor: mainWithProgress,
  name: 'WithPromiseChunk'
};