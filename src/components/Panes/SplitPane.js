import React from 'react';

export function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="left">
        {props.left}
      </div>
      <div className="right">
        {props.right}
      </div>
    </div>
  );
}
