const each = {
  /**
   * Foreach parallel.
   * @param iterator
   * @param cb
   * @return {Promise<[any , any , any , any , any , any , any , any , any , any]>}
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
   * @return {Promise<null>}
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
};

module.exports = each;
