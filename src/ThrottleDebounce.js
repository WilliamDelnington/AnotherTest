export function debounce(func, delay = 1500) {
  return function (...args) {
    let timeout;

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  }
}

export function throttle(func, delay = 1500) {
  let shouldWait = false;
  let waitingArgs;

  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      func(...waitingArgs);
      waitingArgs = null;
      setTimeout(func, delay);
    }
  }

  return (...args) => {
    if (shouldWait) {
      waitingArgs = args;
      return
    }

    func(...args);
    shouldWait = true;

    setTimeout(timeoutFunc, delay);
  }
}