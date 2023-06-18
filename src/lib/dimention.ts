import { writable } from 'svelte/store';

export const dimensions = writable(getInitialDimensions());

function getInitialDimensions() {
  if (typeof window !== 'undefined') {
    return {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    };
  }

  return {
    innerWidth: 0,
    innerHeight: 0
  };
}
