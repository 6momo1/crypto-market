import React, { useEffect } from 'react';

// import { makeStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import { Swap } from '../interfaces'



interface Props {
    swaps: Swap[] | undefined
}


const swapColumns = [
{ id: "amount0In", label: "Amount0In", minWidth: 170, align:'right' },
{ id: "amount0Out", label: "Amount0Out", minWidth: 170 , align:'right'},
{ id: "amount1In", label: "Amount1In", minWidth: 170 , align:'right'},
{ id: "amount1Out", label: "Amount1Out", minWidth: 170 , align:'right'},
{ id: "amountUSD", label: "amount USD", minWidth: 170 , align:'right'},

]


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});



const DataTable: React.FC <Props> = ({ swaps }) => {


  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  useEffect(() => {
      
    console.log(swaps);

    if (swaps) {
        console.log("swaps loaded");
    }
    
  }, [swaps])

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">


          <TableHead>
            <TableRow>
              {swapColumns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>

            
        { swaps ? swaps.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
                return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {swapColumns.map((column, idx) => {
                        const value = row[column.id];
                        return (
                            <TableCell
                            key={column.id}
                            align={"right"}
                            >
                            {value}
                            </TableCell>
                        );
                    })}
                </TableRow>
                );
            })
        : <></>
        }

          </TableBody>


        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={swaps ? swaps.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}


export default DataTable