import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

function ResultBlock({ item }) {
  const containerRef = useRef(null);
  const [barWidth, setBarWidth] = useState(null);

  useEffect(() => {
    const containerWidth = containerRef.current.offsetHeight;
    if (item) {
      const durationMS = item.timeToOnce * 1000;
      const widthFixed = containerWidth * durationMS;
      setBarWidth((widthFixed / containerWidth) * 100);
    }
  }, [containerRef, item]);

  return (
    <div
      className={item.isFastest ? 'p-2 border-yellow-200 border-2' : 'p-2'}
      ref={containerRef}
    >
      <div>
        Case: <strong>{item.name}</strong> {item.isFastest && <span>🏆</span>}
      </div>
      <div>
        Single Duration (sec):{' '}
        <span className="text-green-600 font-bold">{item.timeToOnce}</span>
      </div>
      <div className="h-9 bg-gray-200 mt-2 mb-4">
        <div
          className="h-full bg-green-600"
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <div>
        Op/sec: <strong>{item.opsSec}</strong>
      </div>
      <div>Error Margin: {item.errMargin}</div>
      <div>Runs: {item.runs}</div>
    </div>
  );
}
ResultBlock.propTypes = {
  item: PropTypes.shape({
    opsSec: PropTypes.number,
    name: PropTypes.string,
    isFastest: PropTypes.bool,
    errMargin: PropTypes.number,
    runs: PropTypes.number,
    timeToOnce: PropTypes.number,
  }),
};

ResultBlock.defaultProps = {
  item: {},
};

export default ResultBlock;
