import Box from '@mui/material/Box'
import Columns from './Column/Column'
import Button from '@mui/material/Button'
import AddBoxIcon from '@mui/icons-material/AddBox'

function ListColumns({ columns }) {
  return (
    <Box sx={{
      bgcolor: 'inherit',
      width: '100%',
      height: '100%',
      overflowX: 'auto',
      overflowY: 'hidden',
      display: 'flex',
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      {columns?.map(column => <Columns key={column._id} column={column} />)}

      {/* Box add new column */}
      <Box sx={{
        minWidth: '200px',
        maxWidth: '200px',
        mx: 2,
        borderRadius: '6px',
        height: 'fit-content',
        bgcolor: '#ffffff3d'
      }}>
        <Button
          startIcon={<AddBoxIcon />}
          sx={{
            color: 'white',
            width: '100%',
            justifyContent: 'flex-start',
            pl: 2.5,
            py: 1
          }}
        >
          Add new column
        </Button>
      </Box>
    </Box>
  )
}

export default ListColumns
