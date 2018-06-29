const each = {
  /**
   * Foreach parallel.
   * @param iterator
   * @param cb
   * @return {Promise<Array>}
   */
  parallel: (iterator, cb) => {
    const promises = [];
    let index = 0;
    for (const item of iterator) { // eslint-disable-line
      promises.push(cb(item, index, iterator));
      index += 1;
    }
    return Promise.all(promises);
  },
  /**
   * Foreach series.
   * @param iterator
   * @param cb
   * @return {Promise<Array>}
   */
  series: async (iterator, cb) => {
    const result = [];
    let index = 0;
    for (const item of iterator) { // eslint-disable-line
      result.push(await cb(item, index, iterator)); // eslint-disable-line
      index += 1;
    }
    return result;
  },
  /**
   * Foreach concurrent.
   * @param iterator
   * @param cb
   * @param concurrency
   * @return {Promise<Array>}
   */
  concurrent: async (iterator, cb, concurrency) => {
    let [result, promises, index] = [[], [], 0];
    for (const item of iterator) { // eslint-disable-line
      promises.push(cb(item, index, iterator));
      index += 1;
      if (promises.length === concurrency) {
        result = result.concat(await Promise.all(promises)); // eslint-disable-line
        promises = [];
      }
    }
    if (promises.length) {
      result = result.concat(await Promise.all(promises));
    }
    return result;
  },
  /**
   * Retry.
   * @param cb
   * @param retries
   * @param options
   * @returns {Promise<*>}
   */
  retry: async (cb, retries, options = {}) => {
    options.args = options.args || [];
    let error;
    for (let i = 0; i <= retries; i += 1) {
      try {
        return await cb(...args, i); // eslint-disable-line
      } catch (err) {
        error = err;
        if (options.throwError && options.throwError(error)) {
          throw error;
        }
      }
    }
    throw error;
  },
};

module.exports = each;
