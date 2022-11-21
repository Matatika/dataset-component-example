import Metadata from '../components/charts/Metadata'
import defaultPalette, { getColours } from '../components/charts/Palettes'
import TreemapMetric from './TreemapMetric'

const truncate = (str: string, max = 50) => {
  if (str.length > max) {
    return `${str.substring(0, max)}...`
  }
  return str
}

const formAggregateData = (chartType: string, metadata: Metadata, results: any[]) => {
  const colours = getColours(metadata ? metadata.getPalette() : defaultPalette)
  const cjsData: any = {
    aggregateIndex: [],
    labels: [],
    datasets: []
  }
  const fields = Object.keys(results[0])
  const aggregates = metadata ? metadata.getAggregateKeys() : []
  const columns = metadata ? metadata.getColumnKeys() : []
  const dataSets = {}
  results.forEach(row => {
    let label: any = []
    fields.forEach(key => {
      // process aggregates into datasets data
      if (aggregates && aggregates.includes(key)) {
        const color = colours.next().value
        if (!dataSets[key]) {
          dataSets[key] = {
            label: metadata.chartLabel(key),
            data: [],
            backgroundColor: color.backgroundColor,
            borderColor: color.borderColor,
            borderWidth: 1,
            yAxisID: metadata.getAggregate(key).yaxis ? metadata.getAggregate(key).yaxis : 'y',
          }
          if (chartType === 'line') {
            dataSets[key].fill = false
          }
          if (chartType === 'area') {
            dataSets[key].fill = true
          }
          if (chartType === 'scatter') {
            dataSets[key].showLine = false
          }
        }
        dataSets[key].data.push(row[key])
      } else {
        if (columns && columns.includes(key)) {
          label.push(row[key])
        }
      }
    })
    label = truncate(label.join('-'))
    cjsData.labels.push(label)
  })
  Object.keys(dataSets).forEach(k => {
    cjsData.datasets.push(dataSets[k])
    cjsData.aggregateIndex.push(k)
  })
  return cjsData
}

const formPointData = (metadata: Metadata, results: any[]) => {
  const colours = getColours(metadata ? metadata.getPalette() : defaultPalette)
  const cjsData: any = {
    aggregateIndex: [],
    labels: [],
    datasets: []
  }
  const fields = Object.keys(results[0])
  const aggregates = metadata.getAggregateKeys()
  // const columns = difference(fields, aggregates)
  results.forEach(row => {
    const data: any = []
    const backgroundColor: any = []
    fields.forEach(key => {
      // only include in chart data if found in aggregates metadata
      if (aggregates && aggregates.includes(key)) {
        // replace label with metadata aggregate label
        const label: any = metadata.chartLabel(key)
        cjsData.labels.push(label)
        // arc color
        const color = colours.next().value
        backgroundColor.push(color.backgroundColor)
        // data
        data.push(row[key])
        cjsData.aggregateIndex.push(key)
      }
    })
    cjsData.datasets.push({ data, backgroundColor })
  })
  return cjsData
}

export const updateChartData = (
  chartType: string,
  metadata: Metadata,
  results: any[],
  componentIsMounted: React.MutableRefObject<boolean>,
  setChartData: React.Dispatch<React.SetStateAction<any>>,
  dataCallback?: (data: any) => void
) : void => {
  let formattedData: any = {
    aggregateIndex: [],
    labels: [],
    datasets: []
  }
  if (results && results.length > 0) {
    if (results.length === 1 && results[0].error) {
      console.log(results[0].error)
    }
    if (metadata) {
      if (chartType === 'pie' || chartType === 'doughnut') {
        formattedData = formPointData(metadata, results)
      } else if (chartType === 'treemap') {
        const formTreemapData = new TreemapMetric(metadata, results)

        formattedData = formTreemapData.getData()
      } else {
        formattedData = formAggregateData(chartType, metadata, results)
      }
    } else {
      formattedData = formAggregateData(chartType, metadata, results)
    }
  }
  if (dataCallback) {
    dataCallback(formattedData)
  }
  if (!componentIsMounted.current) return
  setChartData({
    ready: true,
    aggregateIndex: formattedData.aggregateIndex,
    labels: formattedData.labels,
    datasets: formattedData.datasets
  })
}
