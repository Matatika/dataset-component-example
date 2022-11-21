import './App.css';
import { Button, TextField } from '@material-ui/core'
import {useState, FunctionComponent} from 'react'
import axios from 'axios'
import Chart from './components/Chart'
import IDataset from './models/IDataset';

const App: FunctionComponent = () => {

  const [isGetDatasetReady, setGetDatasetReady] = useState(true);

  const [token, setToken] = useState('');
  const [datasetId, setDatasetId] = useState('');

  const [datasetData, setDatasetData] = useState<IDataset>();

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/'
  })

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setToken(event.target.value);
  };


  const handleDatasetIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatasetId(event.target.value);
  };

  const handleGetDataset = async () => {
    setGetDatasetReady(false)

    const requestLink = 'datasets/' + datasetId
    api.defaults.headers.common['Authorization'] = 'bearer ' + token

    api.get(requestLink).then(resp => {
      setDatasetData(resp.data)
      setGetDatasetReady(true)
    })
  }

  return (
    <div className="App">
      <div className='App-body'>
        <h1>Matatika Dataset Component Example</h1>
        <TextField
          id='bearer-token'
          fullWidth
          autoFocus
          required
          onChange={handleTokenChange}
          value={token}
          variant="outlined"
          margin="dense"
          label="Matatika Bearer Token"
        />
        <TextField
          id='dataset'
          fullWidth
          required
          onChange={handleDatasetIdChange}
          variant="outlined"
          margin="dense"
          label="Dataset"
        />
        <div className='button-div'>
          <Button
              onClick={handleGetDataset}
              disabled={!isGetDatasetReady}
              >
              Get Dataset
          </Button>
        </div>
        <div className='chart-div'>
          {datasetData && <><h2>{datasetData.title}</h2><Chart dataset={datasetData} token={token} /></>}
        </div>
      </div>
    </div>
  );
}

export default App;
