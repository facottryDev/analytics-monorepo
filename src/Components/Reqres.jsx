import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import axios from 'axios';

const Reqres = () => {
  const [url, setUrl] = useState('');
  const [bodyKeyValues, setBodyKeyValues] = useState([{ key: '', value: '' }]);
  const [headerKeyValues, setHeaderKeyValues] = useState([{ key: '', value: '' }]);
  const [response, setResponse] = useState(null);

  const handleChange = (index, event, type) => {
    const { name, value } = event.target;
    if (type === 'body') {
      const list = [...bodyKeyValues];
      list[index][name] = value;
      setBodyKeyValues(list);
    } else {
      const list = [...headerKeyValues];
      list[index][name] = value;
      setHeaderKeyValues(list);
    }
  };

  const handleAddClick = (type) => {
    if (type === 'body') {
      setBodyKeyValues([...bodyKeyValues, { key: '', value: '' }]);
    } else {
      setHeaderKeyValues([...headerKeyValues, { key: '', value: '' }]);
    }
  };

  const handleRemoveClick = (index, type) => {
    if (type === 'body') {
      const list = [...bodyKeyValues];
      list.splice(index, 1);
      setBodyKeyValues(list);
    } else {
      const list = [...headerKeyValues];
      list.splice(index, 1);
      setHeaderKeyValues(list);
    }
  };

  const handleSubmit = async () => {
    const headers = {};
    headerKeyValues.forEach(({ key, value }) => {
      if (key && value) headers[key] = value;
    });

    const body = {};
    bodyKeyValues.forEach(({ key, value }) => {
      if (key && value) body[key] = value;
    });

    try {
      const res = await axios.post(url, body, { headers });
      setResponse(res.data);
    } catch (error) {
      console.error(error);
      setResponse({ error: 'Failed to fetch data' });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Request
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Typography variant="h6">Body</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bodyKeyValues.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      name="key"
                      value={item.key}
                      onChange={(e) => handleChange(index, e, 'body')}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="value"
                      value={item.value}
                      onChange={(e) => handleChange(index, e, 'body')}
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleRemoveClick(index, 'body')}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}>
                  <Button onClick={() => handleAddClick('body')}>Add</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Headers</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {headerKeyValues.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      name="key"
                      value={item.key}
                      onChange={(e) => handleChange(index, e, 'headers')}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="value"
                      value={item.value}
                      onChange={(e) => handleChange(index, e, 'headers')}
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleRemoveClick(index, 'headers')}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}>
                  <Button onClick={() => handleAddClick('headers')}>Add</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Button variant="contained" onClick={handleSubmit}>Submit</Button>

      {response && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Response</Typography>
          <Paper sx={{ padding: 2 }}>
            <Typography>{JSON.stringify(response, null, 2)}</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Reqres;
