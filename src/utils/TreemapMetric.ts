import lodash from 'lodash'
import Metadata from '../components/charts/Metadata'
import defaultPalette, { getRgbaString } from '../components/charts/Palettes'

class TreemapMetric {
    metadata: Metadata;
    results: any[];
    palette: any[];

    constructor (metadata: Metadata, results: any[]) {
      this.metadata = metadata
      this.results = results
      this.palette = this.metadata ? this.metadata.getPalette() : defaultPalette
    }

    public getData () : any {
      const cjsData: any = {
        aggregateIndex: [],
        labels: [],
        datasets: []
      }
      let treeValueKey: any = null
      let label: any = null
      const columns = this.metadata.getColumnKeys()
      const aggregates = this.metadata.getAggregateKeys()
      if (aggregates) {
        aggregates.forEach(key => {
          label = this.metadata.chartLabel(key)
          cjsData.labels.push(label)
          if (!treeValueKey) {
            treeValueKey = key
          }
        })
      }
      const uniqItems = lodash.uniqBy(this.results, 'fact_workitem.category')
      const fontSize =
            uniqItems && uniqItems.length && uniqItems.length > 1 ? 80 / uniqItems.length : 30
      cjsData.aggregateIndex.push(treeValueKey)
      cjsData.datasets.push({
        tree: this.results,
        key: treeValueKey,
        groups: columns && columns.length ? columns : aggregates,
        label: label,
        labels: { 
          display: true,
          formatter: (ctx:any) => ctx.raw.s,
          color: (ctx: any) => {
            const item = ctx.dataset.data[ctx.dataIndex]
  
            if (this.results.length > 1 && item.g) {
              const totalItems = lodash.sumBy(this.results, o =>
                Number(o['fact_workitem.total'])
              )
  
              if ((item.s / totalItems) * 100 < 20) {
                return 'transparent'
              }
            }
  
            return '#191919'
          },
          font: {
            size: fontSize,
            weight: 'bold',
            family: 'roboto',
          },
        },
        backgroundColor: (ctx: any) => {
          // change colors on groups
          const item = ctx.dataset.data[ctx.dataIndex]
          if (!item || typeof item.l === 'undefined') {
            return
          }

          const colourCount = this.palette.length
          const paletteIdx = item.s % colourCount
          const backgroundColour = getRgbaString(this.palette, paletteIdx, 0.2)

          return backgroundColour
        }
      })

      return cjsData
    }
}

export default TreemapMetric
