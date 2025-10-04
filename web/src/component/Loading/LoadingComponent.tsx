import { observer } from "mobx-react-lite";
import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";
import { Audio } from 'react-loader-spinner'
const LoadingComponent: React.FC<{ inverted?: boolean; content?: string }> = ({
  inverted = true,
  content
}) => {
  return (
    <div style={{ backgroundColor: 'rgba(211, 211, 211, 0.5)' }}  className=" gap-3 z-50 fixed left-0 top-0 w-full h-full flex flex-col items-center justify-center">
      <Audio
        height="80"
        width="80"
        
        color="grey"
        ariaLabel="loading"

      />
<span >Loading...</span>
    </div>

  );
};

export default observer(LoadingComponent);