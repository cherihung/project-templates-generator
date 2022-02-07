import React from 'react';
import ReactJson from 'react-json-view';

import data from '../data';
import ResultBlock from './ResultBlock';

function App() {
  const [resultsData, setResultsData] = React.useState(null);
  const [metaData, setMetaData] = React.useState(null);
  const [showResult, setShowResult] = React.useState(false);
  const getDate = (date) => new Date(date).toISOString();
  const sortBySpeed = (arr) => arr.sort((a, b) => b.opsSec - a.opsSec);

  const toggleResult = () => {
    setShowResult(!showResult);
  };

  React.useEffect(() => {
    setResultsData(sortBySpeed(data.results));
    setMetaData(data.metaData);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="text-xl mb-5">Benchmark</div>
      {metaData && (
        <>
          <h1 className="text-3xl font-bold pb-2">{metaData.title}</h1>
          <div>
            Date Run:{' '}
            <span className="text-indigo-600">
              {getDate(metaData.timeStamp)}
            </span>
          </div>
        </>
      )}
      {resultsData && (
        <>
          <div className="grid grid-flow-row gap-4 grid-cols-3 mt-3">
            {resultsData.map((item) => (
              <ResultBlock item={item} key={item.name} />
            ))}
          </div>
          <div className="text-xl mt-6 mb-2 font-bold">
            <button className="button" type="button" onClick={toggleResult}>
              {!showResult ? 'Show' : 'Hide'} Full Result
            </button>
          </div>
          {showResult && (
            <ReactJson src={data} displayDataTypes={false} collapsed={3} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
