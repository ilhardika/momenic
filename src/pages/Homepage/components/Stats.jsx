import { useEffect, useRef, useState } from "react";

const useCountUp = (target, duration = 3000, startOnVisible = true) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnVisible) {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
};

const formatNumber = (num) =>
  new Intl.NumberFormat("id-ID").format(num);

const Stats = () => {
  const { count: undanganDibuat, ref: ref1 } = useCountUp(13791);
  const { count: undanganDisebar, ref: ref2 } = useCountUp(2123974);

  return (
    <section className="bg-[#F7F8F4] py-14 sm:py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Tagline */}
        <p className="font-secondary text-center text-[#3F4D34]/80 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Buat undangan digital impianmu dengan{" "}
          <span className="font-semibold text-[#3F4D34]">cepat, hemat</span>{" "}
          dan <span className="font-semibold text-[#3F4D34]">praktis</span>.
          Bebas sebar sepuasnya tanpa batas!
        </p>

        {/* Counters */}
        <div className="grid grid-cols-2 gap-6 sm:gap-10">
          {/* Undangan Dibuat */}
          <div
            ref={ref1}
            className="flex flex-col items-center text-center"
          >
            <span className="font-primary text-4xl sm:text-5xl md:text-6xl text-[#3F4D34] leading-none">
              {formatNumber(undanganDibuat)}
            </span>
            <span className="font-secondary text-sm sm:text-base text-[#3F4D34]/70 mt-2">
              Undangan Dibuat
            </span>
          </div>

          {/* Undangan Disebar */}
          <div
            ref={ref2}
            className="flex flex-col items-center text-center"
          >
            <span className="font-primary text-4xl sm:text-5xl md:text-6xl text-[#3F4D34] leading-none">
              {formatNumber(undanganDisebar)}
            </span>
            <span className="font-secondary text-sm sm:text-base text-[#3F4D34]/70 mt-2">
              Undangan Disebar
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
