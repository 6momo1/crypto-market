import React, { LegacyRef, useEffect, useRef, useState } from "react";
import {
  BarData,
  createChart,
  CrosshairMode,
  WhitespaceData,
} from "lightweight-charts";
import { volumeData } from "../data/mockData/volumeData";
import { priceData } from "../data/mockData/priceData";
import { useFethTokenPrices } from "../hooks/tokenData/useFetchTokenPrices";
import { useFethTokenCharts } from "../hooks/tokenData/useChartData";
import { unixToDate } from "../utils/unixDateConversion";

interface ChartProps {
  address: string;
}

const Chart: React.FC<ChartProps> = ({ address }) => {
  const ref = React.useRef<any>();

  const {
    prices,
    error: priceError,
    loading: priceLoading,
  } = useFethTokenPrices(address);

  const {
    chartData,
    error: chartError,
    loading: chartLoading,
  } = useFethTokenCharts(address);

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
      var candleSeries = chart.addCandlestickSeries({
        upColor: "rgba(255, 144, 0, 1)",
        downColor: "#000",
        borderDownColor: "rgba(255, 144, 0, 1)",
        borderUpColor: "rgba(255, 144, 0, 1)",
        wickDownColor: "rgba(255, 144, 0, 1)",
        wickUpColor: "rgba(255, 144, 0, 1)",
      });

      let formattedChartPrices: BarData[] = [];
      prices?.forEach((priceObj) => {
        const time = unixToDate(priceObj.time);
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
      console.log("formatted: ", formattedChartPrices);
      console.log(formattedChartPrices[0]);

      if (formattedChartPrices && formattedChartPrices[0]) {

        candleSeries.setData([formattedChartPrices[0], formattedChartPrices[1]]);

      }

      // const lineSeries = chart.addLineSeries();

      // lineSeries.setData([
      //   { time: "2019-04-11", value: 80.01 },
      //   { time: "2019-04-12", value: 96.63 },
      //   { time: "2019-04-13", value: 76.64 },
      //   { time: "2019-04-14", value: 81.89 },
      //   { time: "2019-04-15", value: 74.43 },
      //   { time: "2019-04-16", value: 80.01 },
      //   { time: "2019-04-17", value: 96.63 },
      //   { time: "2019-04-18", value: 76.64 },
      //   { time: "2019-04-19", value: 81.89 },
      //   { time: "2019-04-20", value: 74.43 },
      // ]);

      // var volumeSeries = chart.addHistogramSeries({
      //   color: "#26a69a",
      //   priceFormat: {
      //     type: "volume",
      //   },
      //   priceScaleId: "",
      //   scaleMargins: {
      //     top: 0.8,
      //     bottom: 0,
      //   },
      // });

      // volumeSeries.setData(volumeData);
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

export default Chart;
