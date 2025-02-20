import confetti from 'canvas-confetti';

export const fireConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    spread: 360,
    startVelocity: 30,
    gravity: 0.5,
    ticks: 60,
  };

  confetti({
    ...defaults,
    particleCount: count,
    scalar: 1.2,
    shapes: ['star'],
    colors: ['#FFD700', '#FFA500', '#9400D3', '#4B0082']
  });

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: count,
      scalar: 0.75,
      shapes: ['circle'],
      colors: ['#FF1493', '#00BFFF', '#7CFC00', '#FF4500']
    });
  }, 200);
};