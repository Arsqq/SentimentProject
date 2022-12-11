import axios from "axios";
import authHeader from "./auth-header";
import {useEffect, useState} from 'react';

const API_URL = 'http://localhost:8060/api/allUsers/';

export default function RetrieveUsers() {
    const [users,setUsers]=useState([]);
    useEffect(()=>{
        axios.get(API_URL+'listUsers',{headers:authHeader()})
            .then(res=>{
                console.log(res)
                setUsers(res.data)
            })
            .catch(err=>{
                console.log(err)
            })
    },[])
    return (users)
}