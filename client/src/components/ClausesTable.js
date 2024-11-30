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
  ListItemText,
  Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';

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
  const isCritical = clause.isCritical;

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isCritical && (
              <StarIcon color="primary" fontSize="small" />
            )}
            <Typography variant="body1">
              {clause.type}
            </Typography>
          </Box>
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
          {isCritical && (
            <Chip
              size="small"
              label="Critical"
              color="primary"
              variant="outlined"
              sx={{ ml: 1 }}
            />
          )}
        </TableCell>
        <TableCell>
          <Typography variant="body1">
            {clause.summary}
          </Typography>
        </TableCell>
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

  // Separate critical and non-critical clauses
  const criticalClauses = clauses.filter(clause => clause.isCritical);
  const regularClauses = clauses.filter(clause => !clause.isCritical);

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
          {/* Critical clauses */}
          {criticalClauses.map((clause, index) => (
            <ClauseRow key={`critical-${index}`} clause={clause} onClauseClick={onClauseClick} />
          ))}
          
          {/* Divider if there are both critical and regular clauses */}
          {criticalClauses.length > 0 && regularClauses.length > 0 && (
            <TableRow>
              <TableCell colSpan={4} sx={{ p: 0 }}>
                <Divider />
              </TableCell>
            </TableRow>
          )}

          {/* Regular clauses */}
          {regularClauses.map((clause, index) => (
            <ClauseRow key={`regular-${index}`} clause={clause} onClauseClick={onClauseClick} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClausesTable;