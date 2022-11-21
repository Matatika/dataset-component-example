import { Chart as ChartJS, registerables } from 'chart.js'
import {TreemapController, TreemapElement} from 'chartjs-chart-treemap'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { FunctionComponent, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Chart as ChartComponent } from 'react-chartjs-2'
import Metadata from '../components/charts/Metadata'
import { getRgbaString } from '../components/charts/Palettes'
import { ChartjsChartProps } from '../models/ChartJsChart'
import { buildChartOptions } from '../utils/BuildChartOptions'
import { parseJsonSwallowError } from '../utils/chartUtils'
import { updateChartData } from '../utils/UpdateChart'
import '../assets/css/charts/ChartjsChart.css'
import axios from 'axios'

if (registerables) {
  ChartJS.register(...registerables)
}
if (TreemapController && TreemapElement) {
  ChartJS.register(TreemapController, TreemapElement);
}
if (ChartDataLabels) {
  ChartJS.register(ChartDataLabels);
}

function usePrevious (value: any) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const ChartjsChart: FunctionComponent<ChartjsChartProps> = (
  props: PropsWithChildren<ChartjsChartProps>
) => {
  const {
    chartType,
    options,
    dataLink,
    rawData,
    metadata,
    token
  } = props
  const prevProps = usePrevious({
    chartType,
    options,
    dataLink,
    rawData,
    metadata,
    token
  })
  const metadataObj = new Metadata(metadata)
  const [chartData, setChartData] = useState({
    ready: false,
    aggregateIndex: [],
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: getRgbaString(metadataObj.getPalette(), 0, 0.2),
        borderColor: getRgbaString(metadataObj.getPalette(), 0),
        borderWidth: 1
      }
    ]
  })

  // ensure component is still mounted before updating chart
  const componentIsMounted = useRef<boolean>(true)

  // the reference to the chartjs chart
  const chartReference = useRef<ChartJS | null>(null)

  useEffect(() => {
    componentIsMounted.current = true
    const metaObj = new Metadata(metadata)
    if (rawData) {
      updateChartData(
        chartType,
        metaObj,
        parseJsonSwallowError(rawData),
        componentIsMounted,
        setChartData
      )
    } else if (dataLink && dataLink.href) {
      // create api context with auth token
      const api = axios.create({
        baseURL: 'http://localhost:8080/api/'
      })
      api.defaults.headers.common['Authorization'] = 'bearer ' + token
      // we fetch and transform here as the target format needs to be accepted by ChartJS
      api.get(dataLink.href)
        .then((resp: any) => {
          updateChartData(
            chartType,
            metaObj,
            resp.data,
            componentIsMounted,
            setChartData
          )
        })
    }

    // return a cleanup function
    return () => {
      componentIsMounted.current = false
    }
  }, [dataLink, rawData, chartType, metadata, token])

  let chart: any = null;
  const chartOptions = buildChartOptions(
    metadataObj,
    props.chartType,
    props.options
  )
  if (props.chartType && chartData && chartOptions) {
    const { labels, datasets } = chartData
    let theChartData = { labels, datasets }
    let redraw = false
    let theChartType = props.chartType
    if (props.chartType === 'area' || props.chartType === 'scatter') {
      theChartType = 'line' // we set fill to true, area is just a filled line chart
    }
    if (chartData.ready) {
      if (chartReference != null && chartReference.current != null) {
        const chartInstance: ChartJS = chartReference.current
        if (prevProps
            && JSON.stringify((prevProps as any).options) !== JSON.stringify(props.options)
        ) {
          // options changed, chart can be updated
          chartInstance.update()
        }
        if (prevProps
            && (prevProps as any).chartType !== chartType
        ) {
          // type changed, chart must be destroyed
          redraw = true
          theChartData = { labels: [], datasets: [] }
        }
      }

      if (
        theChartType &&
                ['treemap', 'pie', 'doughnut', 'bar', 'line', 'horizontalBar'].includes(
                  theChartType
                )
      ) {
        // odd width and height?  https://github.com/jerairrest/react-chartjs-2/issues/368
        chart = (
                    <ChartComponent
                        id={props.canvasId}
                        ref={chartReference}
                        type={theChartType}
                        redraw={redraw}
                        data={theChartData}
                        options={chartOptions}
                        height={250}
                        width={300}
                    />
        )
      }
    }
  }

  return (
        <>
            <div
                data-testid={props.testId ? props.testId : 'chartjs-chart'}
                data-datasetidx="-1"
                className="chartjs-chart"
            >
                {chart}
            </div>
            <div
                data-testid="chartjs-tooltip"
                className="chartjs-tooltip"
                data-datasetidx="-1"
            >
                <table />
            </div>
        </>
  )
}

ChartjsChart.defaultProps = {
  legend: true
}

export default ChartjsChart
