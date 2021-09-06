import React, { LegacyRef, useEffect, useRef, useState } from "react";
import {
  BarData,
  createChart,
  CrosshairMode,
  HistogramData,
  isUTCTimestamp,
  UTCTimestamp,
  WhitespaceData,
} from "lightweight-charts";
import { useFetchTokenPrices } from "../hooks/tokenData/useFetchTokenPrices";
import { useFetchTokenVolume } from "../hooks/tokenData/useFetchTokenVolume";

interface ChartProps {
  address: string;
}

const PriceChart: React.FC<ChartProps> = ({ address }) => {
  const ref = React.useRef<any>();

  const {
    prices,
    error: priceError,
    loading: priceLoading,
  } = useFetchTokenPrices(address);

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
    if (prices) {

      // initiate candle series
      var candleSeries = chart.addCandlestickSeries({
        upColor: "rgba(255, 144, 0, 1)",
        downColor: "#000",
        borderDownColor: "rgba(255, 144, 0, 1)",
        borderUpColor: "rgba(255, 144, 0, 1)",
        wickDownColor: "rgba(255, 144, 0, 1)",
        wickUpColor: "rgba(255, 144, 0, 1)",
      });
      // format token prices to fit candle series
      let formattedChartPrices: BarData[] = [];
      prices?.forEach((priceObj) => {
        // const time = unixToDate(priceObj.time);
        const time = priceObj.time as UTCTimestamp
        const open = priceObj.open;
        const close = priceObj.close;
        const high = priceObj.high;
        const low = priceObj.low;

        formattedChartPrices.push({
          time,
          open,
          high,
          low,
          close,
        });
      });
      if (formattedChartPrices && formattedChartPrices[0]) {
        candleSeries.setData(formattedChartPrices);
      }

    }

    return () => {
      chart.remove();
    };
  }, [prices]);

  return (
    <>
      <div ref={ref} />
    </>
  );
};

export default PriceChart;
