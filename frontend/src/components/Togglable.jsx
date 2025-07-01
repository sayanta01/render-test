import { useState, useImperativeHandle } from "react";

const Togglable = ({ ref: externalRef, buttonLabel, children }) => {
  const [visible, setVisible] = useState(false);

  const showLoginForm = { display: visible ? "" : "none" };
  const hideLoginButton = { display: visible ? "none" : "" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(externalRef, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideLoginButton}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      {/* children are rendered in the code that is used for rendering the component itself? */}
      {/* Togglable decides when and where the children appear */}
      <div style={showLoginForm} className="togglableContent">
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
};

export default Togglable;
