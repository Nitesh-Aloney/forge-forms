import { useEffect } from 'react';

const useScrollHashIntoView = () => {
  useEffect(() => {
    const { hash = '' } = window.location;
    if (!hash) return;

    const [, elementId] = hash.split('#');

    const element = document.getElementById(elementId);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
};

export default useScrollHashIntoView;
