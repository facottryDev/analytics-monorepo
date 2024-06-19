import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';

const Reqres = ({ selectedEntry }) => {
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [bodyKeyValues, setBodyKeyValues] = useState([]);
  const [headerKeyValues, setHeaderKeyValues] = useState([]);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (selectedEntry) {
      setUrl(`/api/${selectedEntry.endpoint}`);
      setBodyKeyValues(Object.entries(selectedEntry.body || {}).map(([key, value]) => ({ key, value })));
      setHeaderKeyValues(Object.entries(selectedEntry.headers || {}).map(([key, value]) => ({ key, value })));
      fetchResponse(selectedEntry);  // Fetch the response for the selected entry
    }
  }, [selectedEntry]);

  const fetchResponse = async (entry) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...entry.headers,
        },
        body: JSON.stringify(entry.body),
      });
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  return (
    <Box sx={{ padding: '24px', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Request/Response Viewer
      </Typography>
      {selectedEntry && (
        <Paper elevation={3} sx={{ padding: '16px', marginBottom: '24px', borderRadius: '8px' }}>
          <Typography variant="h6" color="primary">URL</Typography>
          <Typography variant="body1" sx={{ marginBottom: '16px', wordWrap: 'break-word' }}>
            {url}
          </Typography>
          <Typography variant="h6" color="primary">Headers</Typography>
          <TableContainer component={Paper} sx={{ marginBottom: '16px', borderRadius: '8px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableRow>
                  <TableCell sx={{ color: theme.palette.common.white }}>Key</TableCell>
                  <TableCell sx={{ color: theme.palette.common.white }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {headerKeyValues.map(({ key, value }, i) => (
                  <TableRow key={i}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6" color="primary">Body</Typography>
          <TableContainer component={Paper} sx={{ marginBottom: '16px', borderRadius: '8px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableRow>
                  <TableCell sx={{ color: theme.palette.common.white }}>Key</TableCell>
                  <TableCell sx={{ color: theme.palette.common.white }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bodyKeyValues.map(({ key, value }, i) => (
                  <TableRow key={i}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6" color="primary">Response</Typography>
          {response ? (
            <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
              <Table>
                <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                  <TableRow>
                    <TableCell sx={{ color: theme.palette.common.white }}>Key</TableCell>
                    <TableCell sx={{ color: theme.palette.common.white }}>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(response).map(([key, value], i) => (
                    <TableRow key={i}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{JSON.stringify(value)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ marginTop: '16px' }}>No response</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Reqres;
