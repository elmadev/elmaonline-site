import ReactDOM from 'react-dom';
import { useEffect, useRef } from 'react';

const portalElement = document.getElementById('portal');

const Portal = ({ children }) => {
  const elRef = useRef(null);
  if (elRef.current === null) {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    portalElement.appendChild(elRef.current);
    return function cleanup() {
      portalElement.removeChild(elRef.current);
    };
  }, []);

  return ReactDOM.createPortal(children, elRef.current);
};

export default Portal;
