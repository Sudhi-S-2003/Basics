import React from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import downloadJson from "./utils/downloadJson";
import downloadCSV from "./utils/downloadCSV";
import JsonUploader from "./JsonUploader";
import CSVUploader from "./CSVUploader";

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
        elevation={3}
      >
        <Typography variant="h4" textAlign="center">
          JSON & CSV Utility
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" onClick={downloadJson}>
            Download JSON
          </Button>
          <Button variant="contained" color="secondary" onClick={downloadCSV}>
            Download CSV
          </Button>
        </Stack>

        <Paper sx={{ p: 2 }} elevation={1}>
          <JsonUploader />
        </Paper>

        <Paper sx={{ p: 2 }} elevation={1}>
          <CSVUploader />
        </Paper>
      </Paper>
    </Box>
  );
}

export default App;
