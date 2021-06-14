import React from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const Column3D = ({data}) => {
  const chartConfigs = {
    type: 'column3d',
    width: '100%',
    height: 400,
    dataFormat: 'json',
    dataSource: {
      chart: {
        caption: "Most Popular",
        theme: "fusion",
        xAxisName: "Repos",
        xAxisNameFontSize: "16px",
        yAxisName: "Stars",
        yAxisNameFontSize: "16px",
      },
      data
    },
  };

  return <ReactFC {...chartConfigs} />;
};

export default Column3D;
