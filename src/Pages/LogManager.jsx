import { useState, useEffect } from "react";
import axios from "axios";
import CheckLogs from "../Components/CheckLogs";
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
} from "@mui/material";

const LogManager = () => {
  const [countries, setCountries] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/data-options"
        );
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

  const handleCountryChange = (country) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((item) => item !== country)
        : [...prev, country]
    );
  };

  const handleSubscriptionChange = (subscription) => {
    setSelectedSubscriptions((prev) =>
      prev.includes(subscription)
        ? prev.filter((item) => item !== subscription)
        : [...prev, subscription]
    );
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

  const paginatedEntries = entries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Log Manager
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px", // Adds space between the boxes
          marginBottom: "24px", // Adds some space below the boxes
        }}
      >
        <Box
          sx={{
            border: "1px solid #1976d2", // Primary color border
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap:"20px",
            width: "100%",
            maxWidth: "300px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional shadow for a nicer look
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: "8px", color: "#1976d2" }}
          >
            Countries
          </Typography>
          <CheckLogs
            items={countries}
            selectedItems={selectedCountries}
            handleChange={handleCountryChange}
          />
        </Box>

        <Box
          sx={{
            border: "1px solid #1976d2", // Primary color border
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap:"20px",
            width: "100%",
            maxWidth: "300px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional shadow for a nicer look
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: "8px", color: "#1976d2" }}
          >
            Subscriptions
          </Typography>
          <CheckLogs
            items={subscriptions}
            selectedItems={selectedSubscriptions}
            handleChange={handleSubscriptionChange}
          />
        </Box>
      </Box>

      <Button variant="contained" color="primary" onClick={handleCheckLogs}>
        Check Logs
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Project ID</TableCell>
              <TableCell>Company ID</TableCell>
              <TableCell>Action Items</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEntries.map((entry) => (
              <TableRow key={entry.srNumber}>
                <TableCell>{entry.srNumber}</TableCell>
                <TableCell>{entry.country}</TableCell>
                <TableCell>{entry.subscription}</TableCell>
                <TableCell>{entry.projectId}</TableCell>
                <TableCell>{entry.companyId}</TableCell>
                <TableCell>{entry.actionItems}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={entries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Box>
  );
};

export default LogManager;
