import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link,
  Collapse,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';

const IssueSeverityIcon = ({ severity }) => {
  switch (severity.toLowerCase()) {
    case 'high':
      return <ErrorOutlineIcon color="error" />;
    case 'medium':
      return <WarningAmberIcon color="warning" />;
    case 'low':
      return <InfoIcon color="info" />;
    default:
      return null;
  }
};

const ClauseRow = ({ clause, onClauseClick }) => {
  const [open, setOpen] = useState(false);
  const hasIssues = clause.potentialIssues && clause.potentialIssues.length > 0;

  return (
    <>
      <TableRow>
        <TableCell>
          {hasIssues && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
          {clause.type}
        </TableCell>
        <TableCell>
          <Link
            component="button"
            onClick={() => onClauseClick(clause)}
            sx={{
              textAlign: 'left',
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {clause.title}
          </Link>
          {hasIssues && (
            <Chip
              size="small"
              label={`${clause.potentialIssues.length} ${
                clause.potentialIssues.length === 1 ? 'issue' : 'issues'
              }`}
              color="warning"
              sx={{ ml: 1 }}
            />
          )}
        </TableCell>
        <TableCell>{clause.summary}</TableCell>
        <TableCell>{clause.location}</TableCell>
      </TableRow>
      {hasIssues && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <List>
                  {clause.potentialIssues.map((issue, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IssueSeverityIcon severity={issue.severity} />
                            <Typography variant="subtitle2">
                              {issue.description}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ ml: 4 }}>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              Recommendation: {issue.recommendation}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const ClausesTable = ({ clauses, onClauseClick }) => {
  if (!clauses || clauses.length === 0) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="subtitle1">Type</Typography></TableCell>
            <TableCell><Typography variant="subtitle1">Title</Typography></TableCell>
            <TableCell><Typography variant="subtitle1">Summary</Typography></TableCell>
            <TableCell><Typography variant="subtitle1">Location</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clauses.map((clause, index) => (
            <ClauseRow key={index} clause={clause} onClauseClick={onClauseClick} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClausesTable;