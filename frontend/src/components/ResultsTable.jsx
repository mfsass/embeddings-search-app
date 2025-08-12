import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper, Chip, LinearProgress, Typography, Stack, Divider } from '@mui/material';

// Simple formatter helpers (avoid complex getters that hid raw string values)
const fmt = (v) => (v === undefined || v === null || v === '') ? '' : String(v);
const fmtSpend = (v) => {
  if (v === undefined || v === null || v === '') return '';
  const n = Number(v);
  return isNaN(n) ? String(v) : `R${n.toLocaleString()}`;
};

const columns = [
  { field: 'profile_id', headerName: 'ID', width: 90, headerAlign: 'center', align: 'center' },
  { field: 'age', headerName: 'Age', width: 70, headerAlign: 'center', align: 'center' },
  { field: 'dependent_count', headerName: 'Deps', width: 70, headerAlign: 'center', align: 'center' },
  { field: 'profile_brand_group_key', headerName: 'Brand Group', width: 130 },
  { field: 'restaurant_name', headerName: 'Restaurant', width: 180 },
  { field: 'yearly_spend', headerName: 'Spend (R)', width: 130, headerAlign: 'center', align: 'right',
    renderCell: (params) => {
      const raw = params?.row?.yearly_spend;
      return <Box sx={{ fontWeight: 500 }}>{fmtSpend(raw)}</Box>;
    }
  },
  { field: 'main_segment', headerName: 'Segment', width: 110,
    renderCell: ({ value }) => {
      const color = value === 'Champions' ? 'success' : value === 'Promising' ? 'warning' : 'default';
      return value ? <Chip label={value} color={color} size="small" variant="outlined" /> : '';
    }
  },
  { field: 'campaign_vouchers', headerName: 'Camp Vouchers', width: 125, headerAlign: 'center', align: 'center' },
  { field: 'regular_vouchers', headerName: 'Reg Vouchers', width: 120, headerAlign: 'center', align: 'center' },
  { field: 'brand_count', headerName: 'Brands', width: 80, headerAlign: 'center', align: 'center' },
  { field: 'similarity', headerName: 'Match %', width: 150, type: 'number',
    valueFormatter: (p) => (p.value !== undefined && p.value !== null && p.value !== '') ? `${(Number(p.value) * 100).toFixed(1)}%` : '',
    renderCell: (params) => {
      const raw = params?.row?.similarity;
      if (raw === undefined || raw === null || raw === '') return '';
      const num = Number(raw);
      if (isNaN(num)) return '';
      const percentage = num * 100;
      const color = percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error';
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            color={color}
            sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
          />
          <Box sx={{ minWidth: 45, fontSize: '0.875rem', fontWeight: 600 }}>
            {percentage.toFixed(1)}%
          </Box>
        </Box>
      );
    },
    cellClassName: 'similarity-cell',
    headerAlign: 'center',
    // Ensure descending by default - highest similarity first
    sortable: true,
  },
  // profile_text intentionally omitted per design
];

export default function ResultsTable({ rows }) {
  if (!rows.length) return null;

  // DataGrid expects id field
  const tableRows = rows.map(r => ({ id: r.profile_id, ...r }));

  // Compute total explicit width of columns
  const tableWidth = columns.reduce((sum,c)=> sum + (c.width||100), 0);

  // Summary calculations
  const total = rows.length;
  const avgSpend = total ? rows.reduce((a,c)=> a + Number(c.yearly_spend||0),0)/total : 0;
  const segments = rows.reduce((acc,c)=> { if(c.main_segment){ acc[c.main_segment]= (acc[c.main_segment]||0)+1; } return acc; }, {});

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', width: tableWidth }}>
        {/* Summary Header */}
        <Box sx={{ px: 3, pt: 2, pb: 1.5 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Results</Typography>
            <Chip label={`${total} matched`} color="primary" size="small" />
            {Object.entries(segments).map(([seg,count]) => (
              <Chip key={seg} label={`${seg}: ${count}`} size="small" variant="outlined" />
            ))}
            <Chip label={`Avg Spend R${Math.round(avgSpend).toLocaleString()}`} size="small" variant="outlined" />
          </Stack>
        </Box>
        <Divider />
        <DataGrid
          rows={tableRows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[10, 25, 50, 100]}
          disableSelectionOnClick
          autoHeight
          columnBuffer={2}
          columnThreshold={2}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '0.875rem',
              fontWeight: 600,
            },
            '& .MuiDataGrid-cell': {
              fontSize: '0.875rem',
              borderBottom: '1px solid #f1f5f9',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f8fafc',
            },
            '& .similarity-cell': {
              fontWeight: 600,
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '2px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }
          }}
          initialState={{
            sorting: { sortModel: [{ field: 'similarity', sort: 'desc' }] },
          }}
        />
      </Paper>
    </Box>
  );
}
