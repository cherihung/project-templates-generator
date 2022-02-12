/** EXAMPLE TEST SUITE **/
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
      return item;
     } catch(err) {
      console.error('error: ', err)
     }
   })
}

async function mainWithProgressSeparate({names}) {
  await populateQueueEach(names);
}

module.exports = {
  executor: mainWithProgressSeparate,
  name: 'WithGeneratorTracker'
};