export const cacheManager = {
  set: (key: string, data: any, ttl: number = 3600) => {
    localStorage.setItem(key, JSON.stringify({
      data,
      expires: Date.now() + (ttl * 1000)
    }));
  },
  get: (key: string) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, expires } = JSON.parse(cached);
    if (Date.now() > expires) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  }
};