import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {NavBarComponent} from "./navBar.component";
import RetrieveUsers from "../Service/data.service";
import axios from "axios";
import authHeader from "../Service/auth-header";
import {useEffect, useState} from "react";
import {button} from "react-validation/build/main";
import {makeStyles} from "@mui/styles"

const API_URL = "http://localhost:8060/api/allUsers/";

function createData(
    username:string,
    id:number,
    mail:string,
    roles:[]
){
    return{
        username,
        id,
        mail,
        roles
    }
}


function deleteUser(id){
    axios.delete(API_URL+'delete/'+id,{headers: authHeader()}).
    then( res =>{

        console.log(res.data)
    })
}


const useStyles = makeStyles({
    table: {
        minWidth: 650,
        "& .MuiTableCell-root": {
            borderLeft: "1px solid rgba(224, 224, 224, 1)"
        },
        fontFamily:'Chocolate cyr-lat'
    }
});

function Row(props: { row: ReturnType<createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" style={{fontFamily: 'Chocolate cyr-lat'}}>
                    {row.username}
                </TableCell>
                <TableCell align="center" style={{fontFamily: 'Chocolate cyr-lat'}}>{row.mail}</TableCell>
                <TableCell align="center" style={{fontFamily: 'Chocolate cyr-lat'}}>{row.roles[0].name}</TableCell>
                <TableCell align="center" style={{fontFamily: 'Chocolate cyr-lat'}} >{row.dateOfLastLogOn}</TableCell>
                <TableCell align="center" style={{fontFamily: 'Chocolate cyr-lat'}}>
                <button  value="delete" className="btn" onClick={()=>deleteUser(row.id)}>
                    <i className="fa fa-trash"/>
                </button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography  style={{fontFamily: 'Chocolate cyr-lat'}} variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            <Table className={classes.table} size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}}>Date</TableCell>
                                        <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}}>Analysis ID</TableCell>
                                        <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}} align="center">Data Amount</TableCell>
                                        <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}} align="center">Positive percent</TableCell>
                                        <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}} align="center">Negative percent</TableCell>
                                        <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}} align="center">Verdict</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.performedAnalyzes.map((analRow,index) => (
                                        <TableRow key={index}>
                                            <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}} component="th" scope="row">
                                                {analRow.runAt}
                                            </TableCell>
                                            <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}}> {analRow.id}</TableCell>
                                            <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}} align="center">{analRow.amountOfData}</TableCell>
                                            <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}} align="center">{analRow.positivePercent}</TableCell>
                                            <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}} align="center">{analRow.negativePercent}</TableCell>
                                            <TableCell  style={{fontFamily: 'Chocolate cyr-lat'}} align="center">MOSTLY POSITIVE</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function CollapsibleTable() {
    const[userList,setUserList]=useState([])
    const classes = useStyles();
    useEffect(()=>{
        getUsers();
    },[])

    function getUsers(){
        axios.get(API_URL+'listUsers',{headers:authHeader()})
            .then(res=>{
                setUserList(res.data)
                console.log(res.data)});
    }

    return (
        <div id="wrapper">
            <NavBarComponent> </NavBarComponent>
        <TableContainer component={Paper} className={classes.table} style={{fontFamily: 'Chocolate cyr-lat'}}>
            <Table aria-label="collapsible table" style={{fontFamily: 'Chocolate cyr-lat'}}>
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell align="center" style={{fontFamily: 'Chocolate cyr-lat'}}>Moderator's Name</TableCell>
                        <TableCell align="center" style={{fontFamily: 'Chocolate cyr-lat'}}>Email</TableCell>
                        <TableCell align="center" style={{fontFamily: 'Chocolate cyr-lat'}}>Role&nbsp;</TableCell>
                        <TableCell align="center" style={{fontFamily: 'Chocolate cyr-lat'}}>Date of Last log on&nbsp;</TableCell>
                        <TableCell align="center" style={{fontFamily: 'Chocolate cyr-lat'}}>Action&nbsp;</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        userList.map((row)=>(
                          <Row key={row.name} row={row}/>
                            )
                        )
                    }

                </TableBody>
            </Table>
        </TableContainer>
        </div>
    );
}