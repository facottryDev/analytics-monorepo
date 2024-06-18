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
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import Reqres from "../Components/Reqres";

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
    <>
      <Box sx={{ padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom>
          Log Manager
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <Card sx={{ maxWidth: "300px", flexGrow: 1 }}>
            <CardHeader
              title="Countries"
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            />
            <CardContent>
              <CheckLogs
                items={countries}
                selectedItems={selectedCountries}
                handleChange={handleCountryChange}
              />
            </CardContent>
          </Card>

          <Card sx={{ maxWidth: "300px", flexGrow: 1 }}>
            <CardHeader
              title="Subscriptions"
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            />
            <CardContent>
              <CheckLogs
                items={subscriptions}
                selectedItems={selectedSubscriptions}
                handleChange={handleSubscriptionChange}
              />
            </CardContent>
          </Card>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckLogs}
          sx={{ marginBottom: "24px" }}
        >
          Check Logs
        </Button>

        <Paper elevation={3} sx={{ padding: "16px" }}>
          <TableContainer>
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
          <Divider sx={{ marginY: "16px" }} />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={entries.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </Paper>
      </Box>
      <Reqres />
    </>
  );
};

export default LogManager;
