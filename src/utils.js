export function promisify(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  };
}

async function getData(url) {
  const data = await fetch(url, {
    mode: 'no-cors'
  }).then(response => response.json());
  return data;
}

const cache = new Map();
export function useData(url) {
  if (!cache.has(url)) cache.set(url, getData(url));
  const response = cache.get(url);
  return promisify(response);
}