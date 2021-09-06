import React, { LegacyRef, useEffect, useRef, useState } from "react";
import {
  BarData,
  createChart,
  CrosshairMode,
  HistogramData,
  UTCTimestamp,
} from "lightweight-charts";
import { useFetchTokenPrices } from "../hooks/tokenData/useFetchTokenPrices";
import { useFetchTokenVolume } from "../hooks/tokenData/useFetchTokenVolume";

interface ChartProps {
  address: string;
}

const VolumeChart: React.FC<ChartProps> = ({ address }) => {
  const ref = React.useRef<any>();

  const {
    chartData: volumeData,
    error: chartError,
    loading: chartLoading,
  } = useFetchTokenVolume(address);

  useEffect(() => {
    const chart = createChart(ref.current, {
      width: 600,
      height: 300,
      layout: {
        backgroundColor: "#000000",
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      grid: {
        vertLines: {
          color: "rgba(197, 203, 206, 0.5)",
        },
        horzLines: {
          color: "rgba(197, 203, 206, 0.5)",
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: "rgba(197, 203, 206, 0.8)",
      },
      timeScale: {
        borderColor: "rgba(197, 203, 206, 0.8)",
      },
    });
    if (volumeData) {
      
      var volumeSeries = chart.addHistogramSeries({
        color: "#26a69a",
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "",
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      let formattedVolumes: HistogramData[] = [];
      volumeData?.forEach((volumeObj) => {
        const time = volumeObj.date as UTCTimestamp
        const value =  parseFloat(volumeObj.volumeUSD)
        formattedVolumes.push({ time, value, color : "rgba(255, 255, 255, 1)"})
      });
      if (volumeData) {
        // candleSeries.setData(volumeData);
          volumeSeries.setData(formattedVolumes);
      }
    }

    return () => {
      chart.remove();
    };
  }, [volumeData]);

  return (
    <>
      <div ref={ref} />
    </>
  );
};

export default VolumeChart
