// Add callback argument to async function while still supporting async/await
export default function callbackWrapper<
  T extends (...args: any[]) => Promise<any> | any
>(func: T): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>) => {
    const callbackIndex = func.length;
    const callback = args[callbackIndex];

    const result = func(...(callback ? args.slice(0, -1) : args));

    if (callback) {
      if (result instanceof Promise) {
        result.then((...args: any[]) => {
          callback(...args);
        });
      } else {
        callback(result);
      }
    }

    return result;
  };
}
