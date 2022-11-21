/* eslint-disable */
import { IMetaDataProps } from '../../models/metadata'
import { parseJsonSwallowError } from '../../utils/chartUtils'
import defaultPalette from './Palettes'

class Metadata {
    private metadataObj: IMetaDataProps;
    private parseError: Error = null as any;

    constructor (metadata: IMetaDataProps | string, metadataErrorCallback?: (e: any) => void) {
      if (typeof metadata === 'string') {
        this.metadataObj = parseJsonSwallowError(metadata, (e: any) => {
          this.parseError = e
          if (metadataErrorCallback) {
            metadataErrorCallback(e)
          }
        })
      } else {
        this.metadataObj = metadata
      }
    }

    getParseError () {
      return this.parseError
    }

    getGlobalLinks () {
      if (this.metadataObj) {
        return this.metadataObj.links
      }

      return null
    }

    chartLabel = (id: any) => {
      const agg = this.getAggregate(id)
      return agg ? agg.label : id
    };

    getAggregate = (id: any) => {
      if (!this.metadataObj) return null
      let resultAggregates: any[] = []
      if (
        this.metadataObj &&
            this.metadataObj.related_table &&
            this.metadataObj.related_table.aggregates
      ) {
        resultAggregates = this.metadataObj.related_table.aggregates
      }
      const agg = resultAggregates.find(
        aggregate => this.metadataObj.name + '.' + aggregate.name === id
      )
      return agg
    };

    getMetaDataObj () {
      return this.metadataObj
    }

    getMetaDataObjStringify () {
      if (this.metadataObj !== null) {
        return JSON.stringify(this.metadataObj)
      }

      return null
    }

    getAggregateKeys = () => {
      if (this.metadataObj) {
        let resultAggregates: any[] = []
        if (
          this.metadataObj &&
                this.metadataObj.related_table &&
                this.metadataObj.related_table.aggregates
        ) {
          resultAggregates = this.metadataObj.related_table.aggregates
        }
        return resultAggregates.map(item => this.metadataObj.name + '.' + item.name)
      }
      return null
    };

    getColumnKeys = () => {
      if (this.metadataObj) {
        let resultColumns: any[] = []
        if (
          this.metadataObj &&
                this.metadataObj.related_table &&
                this.metadataObj.related_table.columns
        ) {
          resultColumns = this.metadataObj.related_table.columns
        }
        return resultColumns.map(item => this.metadataObj.name + '.' + item.name)
      }
      return null
    };

    getDrilldownLinks = () => {
      const aggregates = this.metadataObj?.related_table?.aggregates
      const aggregateLinks =
            aggregates !== undefined && aggregates.length > 0 && aggregates[0]?.links !== undefined
              ? aggregates[0]?.links
              : []
      const globalLinks =
            this.metadataObj && this.metadataObj.links ? this.metadataObj.links : []
      const drilldownLinks = aggregateLinks.length > 0 ? aggregateLinks : globalLinks

      return drilldownLinks
    };

    getType = (type: any) => {
      // convert our type to google chart type
      let gtype: any = null;
      switch (type) {
        case 'sum':
          gtype = 'number'
          break
        default:
          gtype = 'string'
          break
      }
      return gtype
    };

    // get column metadata (type, label) by id, else returns the key
    getColumn = (id: any) => {
      if (this.metadataObj && this.metadataObj.related_table) {
        const resultColumns: any[] = this.metadataObj.related_table.columns
        if (resultColumns) {
          const column = resultColumns.find(c => this.metadataObj.name + '.' + c.name === id)
          if (column) {
            return {
              type: this.getType(column.type),
              label: column.label
            }
          }
        }
        const aggColumns: any[] = this.metadataObj.related_table.aggregates
          ? this.metadataObj.related_table.aggregates
          : []
        if (aggColumns) {
          const column = aggColumns.find(c => this.metadataObj.name + '.' + c.name === id)
          if (column) {
            return {
              type: this.getType(column.type),
              label: column.label
            }
          }
        }
      }
      return id
    };

    getPalette = (): number[][] => {
      if (this.metadataObj && this.metadataObj.palette) {
        return this.metadataObj.palette
      }

      return defaultPalette
    };
}

export default Metadata
