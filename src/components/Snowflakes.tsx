import { useEffect, useState } from 'react';

const Snowflakes = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 10}s`,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute text-2xl animate-snowfall"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowflakes;
