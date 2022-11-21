import React from 'react'
import { ChartProps } from '../models/Chart'
import { parseJsonSwallowError } from '../utils/chartUtils'
import '../assets/css/charts/Chart.css'
import ChartjsChart from './ChartjsChart'
import Metadata from './charts/Metadata'

class Chart extends React.Component<ChartProps> {

    public render () {
      const { dataset } = this.props
      let chart: any = null

      if (dataset) {
        let dataLink = null
        if (dataset._links && dataset._links.data) {
          dataLink = dataset._links.data
        }
        const visualisation = parseJsonSwallowError(dataset.visualisation)
        const _Metadata = new Metadata(dataset.metadata)

        if (_Metadata.getParseError() != null) {
          chart = (<div className="chart-no-metadata">
                      <>
                        <span>Unable to parse &apos;metadata&apos; for this dataset -</span>
                        <br />
                        {_Metadata.getParseError()}
                      </>
                    </div>)
        } else if (visualisation && visualisation['chartjs-chart']) {
          const chartjsChart = visualisation['chartjs-chart']
          chart = (
                    <ChartjsChart
                        chartType={chartjsChart.chartType}
                        canvasId={dataset.id}
                        legend={!this.props.compact}
                        options={chartjsChart.options}
                        metadata={dataset.metadata}
                        rawData={dataset.rawData}
                        dataLink={dataLink}
                        token={this.props.token}
                    />
          )
        } else if (visualisation && visualisation.image) {
          const image = visualisation.image
          chart = <img src={image.src} alt={dataset.title} />
        }
      }
      return chart
    }
}

export default Chart
