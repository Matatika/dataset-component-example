import {
  render,
  screen
} from '@testing-library/react'
import '@testing-library/jest-dom'

import Chart from '../components/Chart'


describe('Chart', () => {

  it('renders chart component without crashing', async () => {
    const dataset: any = {
      visualisation: '{ "chartjs-chart": { "chartType": "treemap" } }',
      metadata: '{}',
      _links: {
        data: { href: '/somemockuri' }
      }
    }
    render(<Chart dataset={dataset} />
    )
    const chart = await screen.findByTestId('chartjs-chart')
    expect(chart).toBeInTheDocument()
  })

})