const CircularProgress = ({
  value,
  primaryColor = "#18C4B8",
  secondaryColor = "#EEEEEE",
}) => {
  const strokeWidth = 20;
  const radius = 50 - strokeWidth / 2; // Circle radius
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference; // Calculate progress based on value

  return (
    <div className="relative w-24 h-24">
      {/* Background Circle */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={primaryColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      {/* Value inside the circle */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <p className="text-sm font-semibold text-black">{value}%</p>
      </div>
    </div>
  );
};

export default CircularProgress;
