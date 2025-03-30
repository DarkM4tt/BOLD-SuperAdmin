import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BookingGraph = () => {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const ctx = chart.ctx;

      // Calculate the chart's dimensions for gradient bounds
      const chartArea = chart.chartArea;
      const gradientFill = ctx.createLinearGradient(
        0, // x0
        chartArea.top, // y0
        0, // x1
        chartArea.bottom // y1
      );

      gradientFill.addColorStop(0, "rgba(59, 130, 246, 0.5)"); // Blue with opacity
      gradientFill.addColorStop(0.5, "rgba(59, 130, 246, 0.25)");
      gradientFill.addColorStop(1, "rgba(59, 130, 246, 0)");
      setGradient(gradientFill);
    }
  }, []);

  const data = {
    labels: ["May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Last 6 months",
        data: [200000, 250000, 150000, 270000, 230000],
        borderColor: "#3B82F6", // Blue line color
        backgroundColor: gradient || "rgba(59, 130, 246, 0.5)", // Fallback to solid color
        tension: 0.4, // Curved line
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Same period last year",
        data: [180000, 200000, 140000, 220000, 210000],
        borderColor: "#D1D5DB", // Gray line color
        backgroundColor: "rgba(209, 213, 219, 0.1)", // Light gray area fill
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        borderDash: [5, 5], // Dashed line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: false,
        labels: {
          color: "#6B7280", // Text color
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#111827", // Tooltip background
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF", // Gray ticks
        },
      },
      y: {
        ticks: {
          callback: (value) => `$${value / 1000}k`,
          color: "#9CA3AF",
        },
        grid: {
          display: false,
          color: "rgba(229, 231, 235, 0.3)", // Light gray gridlines
        },
      },
    },
  };

  return (
    <div
      className="px-4 py-6 bg-white rounded-lg mt-6"
      style={{ boxShadow: "0px 8px 24px 0px #4545501A" }}
    >
      <h2 className="text-2xl font-semibold #1A1919 mb-4">
        Booking graph for BOLD customer app
      </h2>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default BookingGraph;
