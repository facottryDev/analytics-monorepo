import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import Reqres from "../Components/Reqres";

const LogManager = () => {
  const [countries, setCountries] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data-options");
        setCountries(response.data.countries || []);
        setSubscriptions(response.data.subscriptions || []);
      } catch (error) {
        console.error("Error fetching data options:", error);
      }
    };

    const fetchEntries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/entries");
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching log entries:", error);
      }
    };

    fetchOptions();
    fetchEntries();
  }, []);

  const handleCountryChange = (event) => {
    setSelectedCountries(event.target.value);
  };

  const handleSubscriptionChange = (event) => {
    setSelectedSubscriptions(event.target.value);
  };

  const handleCheckLogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/entries", {
        params: {
          countries: selectedCountries.join(","),
          subscriptions: selectedSubscriptions.join(","),
        },
      });
      setEntries(response.data);
      setPage(0); // Reset to first page on filter
    } catch (error) {
      console.error("Error fetching log entries:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
  };

  return (
    <Box sx={{ padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Log Manager
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: "24px" }}>
        <FormControl sx={{ margin: "8px", minWidth: 200 }}>
          <InputLabel>Countries</InputLabel>
          <Select
            multiple
            value={selectedCountries}
            onChange={handleCountryChange}
            renderValue={(selected) => selected.join(", ")}
          >
            {countries.map((country, index) => (
              <MenuItem key={index} value={country}>
                <Checkbox checked={selectedCountries.indexOf(country) > -1} />
                <ListItemText primary={country} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ margin: "8px", minWidth: 200 }}>
          <InputLabel>Subscriptions</InputLabel>
          <Select
            multiple
            value={selectedSubscriptions}
            onChange={handleSubscriptionChange}
            renderValue={(selected) => selected.join(", ")}
          >
            {subscriptions.map((subscription, index) => (
              <MenuItem key={index} value={subscription}>
                <Checkbox checked={selectedSubscriptions.indexOf(subscription) > -1} />
                <ListItemText primary={subscription} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleCheckLogs} sx={{ margin: "8px", height: '56px' }}>
          Check Logs
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SR Number</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry, index) => (
              <TableRow key={index} onClick={() => handleEntryClick(entry)} sx={{ cursor: "pointer" }}>
                <TableCell>{entry.srNumber}</TableCell>
                <TableCell>{entry.country}</TableCell>
                <TableCell>{entry.subscription}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleEntryClick(entry); 
                    }}
                    sx={{ 
                      borderColor: '#1976d2', 
                      color: '#1976d2', 
                      '&:hover': {
                        backgroundColor: '#1976d2', 
                        color: '#fff'
                      } 
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={entries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
      {selectedEntry && <Reqres selectedEntry={selectedEntry} />}
    </Box>
  );
};

export default LogManager;
