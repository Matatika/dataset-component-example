import { Chart } from 'chart.js';
import Metadata from '../components/charts/Metadata'

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const buildChartOptions = (
  metadata: Metadata,
  chartType: any,
  newOptions: any
): any => {

  // Setup default options if none supplied
  if (!newOptions) {
    newOptions = {}
  }
  // Setup default plugins if none supplied
  if (!newOptions.plugins) {
    newOptions.plugins = {}
  }

  // enable datalabels for pie and doughnut charts by default, disable by default for all other charts
  if (chartType === 'pie' || chartType === 'doughnut') {
    newOptions.plugins.datalabels = { display: true }
  } else if (!newOptions.plugins.datalabels) {
    newOptions.plugins.datalabels = { display: false }
  }

  // never display the legend on treemap, uses a single dataset so legend is pointless
  if (chartType === 'treemap') {
    newOptions.plugins.legend = { display: false }
    newOptions.plugins.tooltip.callbacks = {
      title: (items: any) => items.map((item: any) => item.dataset.label),
      label: (tooltipCtx: any) => tooltipCtx.raw.s
    }
    newOptions.maintainAspectRatio = false

    const noDataPlugin = {
      id: "noDataPlugin",
      afterDraw: (chart: any) => {
        const datasets = chart.data.datasets
        if (datasets.length > 0) {
          if (datasets[0].data.every((item: any) => item.s === 0)) {
            const ctx = chart.ctx
            const width = chart.width
            const height = chart.height

            chart.clear()
            ctx.save()
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fontSize = 20
            ctx.fillStyle = '#191919'
            ctx.fillText('No data to display', width / 2, height / 2)
            ctx.restore()
          }
        }
      }
    }
    Chart.register(noDataPlugin)
  }
  return newOptions
}
