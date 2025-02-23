export const measurePerformance = (metric: string) => {
  if (performance.mark && process.env.NODE_ENV === 'production') {
    performance.mark(metric);
    // Send to analytics
  }
};