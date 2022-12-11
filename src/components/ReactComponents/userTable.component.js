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




function Row(props: { row: ReturnType<createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

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
                <TableCell component="th" scope="row">
                    {row.username}
                </TableCell>
                <TableCell align="right">{row.mail}</TableCell>
                <TableCell align="right">{row.roles[0].name}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Analysis ID</TableCell>
                                        <TableCell align="right">Data Amount</TableCell>
                                        <TableCell align="right">Verdict</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
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

    useEffect(()=>{
        getUsers();
    },[])

    function getUsers(){
        const getCall=axios.get(API_URL+'listUsers',{headers:authHeader()})
            .then(res=>{
                setUserList(res.data)
                console.log(res.data)})
    }

    return (
        <div id="wrapper">
            <NavBarComponent> </NavBarComponent>
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Moderator's Name</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Role&nbsp;</TableCell>
                        <TableCell align="right">Date of Last log on&nbsp;</TableCell>
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