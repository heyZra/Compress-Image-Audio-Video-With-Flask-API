import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";

const Chart = ({ dataApi }) => {
  const [options, setOptions] = useState({
    chart: {
      type: "column",
    },
    title: {
      text: "Comparison of Results",
    },
    yAxis: {
      title: {
        text: "Size (KB)",
      },
    },
    series: [],
  });

  useEffect(() => {
    if (dataApi) {
      let newOptions = {
        chart: {
          type: "column",
        },
        title: {
          text: "Comparison of Results",
        },
        yAxis: {
          title: {
            text: "Size (KB)",
          },
        },
        series: [],
      };

      if (dataApi.originalName && dataApi.originalName.length === 1) {
        newOptions.series = [
          {
            name: dataApi.originalName,
            data: dataApi.originalSize,
          },
          {
            name: dataApi.compressedName,
            data: dataApi.compressedSize,
          },
        ];
      } else {
        newOptions.series = [
          {
            name: [dataApi.originalName[0], dataApi.originalName[1]],
            data: [dataApi.originalSize[0], dataApi.originalSize[1]],
          },
          {
            name: [dataApi.compressedName[0], dataApi.compressedName[1]],
            data: [dataApi.compressedSize[0], dataApi.compressedSize[1]],
          },
        ];
      }

      setOptions(newOptions);
    }
  }, [dataApi]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Chart;
