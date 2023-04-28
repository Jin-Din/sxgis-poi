//作者:Jin

/**
 * await 辅助方法，捕获返回 error 和 result
 *
 * 返回： [error,result]
 * @param promise
 *   */
export const useAwaitHelper = async <T = any, E = any>(promise: Promise<T>) => {
    try {
      const v = await promise;
      return [null, v as T] as const;
    } catch (e) {
      return [e as E, null] as const;
    }
  };