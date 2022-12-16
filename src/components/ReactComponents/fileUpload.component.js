import React from 'react'
import axios from 'axios';
import authHeader from "../Service/auth-header";
import {CircularProgress, LinearProgress} from "@mui/material";
import Box from "@mui/material/Box";

class FileUpload extends React.Component{
    constructor(){
        super();
        this.state = {
            selectedFile:'',
            sentiments:[],
            trueSentiments:[],
            showMessage: false,
            showResult:false
        }
        this.submit = this.submit.bind(this);



        this.handleInputChange = this.handleInputChange.bind(this);
    }
    _showMessage = (bool) => {
        this.setState({
            showMessage: bool
        });
    }

    _showResult = (bool) => {
        this.setState({
            showResult: bool
        });
    }

    handleInputChange(event) {
        this.setState({
            selectedFile: event.target.files[0],
        })
    }

    submit(){
        this._showResult(false)
        this._showMessage(true)
        const data = new FormData()
        console.log("hi")
        data.append('file', this.state.selectedFile)
        console.warn(this.state.selectedFile);
        let url = "http://localhost:8060/api/sentiment/uploadFile";
        let urlFlask="http://localhost:5000/sentiment";
        axios.post(urlFlask, data, {headers:authHeader()})
            .then(res => { // then print response status
                let sentiments;
                sentiments=res.data
                console.log(sentiments)
                this._showMessage(false)
                this._showResult(true)
                console.warn(res);
                this.setState({
                    sentiments:sentiments,
                });
            })

    }



    render(){
        const resultSentiments=this.state.sentiments
        const trueSentiments=this.state.trueSentiments
        return(
            <div class="d-sm-flex justify-content-around mb-4">
                    <input type="file" class="container-button" name="upload_file" onChange={this.handleInputChange} />
                {this.state.showMessage && <Box sx={{
                    width: '50%',
                    textAlign: "center",
                }}>
                    <h3>Loading in Progress</h3>
                    <LinearProgress/>
                </Box>
                }
                {this.state.showResult && <Box sx={{
                    width: '50%',
                    textAlign: "center",
                }}>
                    <h3>Data is Ready</h3>
                    <LinearProgress variant={"determinate"} value={100}/>
                </Box>
                }
             <div class={"row"}>
                <a class="container-button"  role="button" onClick={()=>this.submit()}>
                    <i class="fas fa-download fa-sm text-white-50"/>
                    &nbsp;Upload</a>
             </div>
            </div>

        )
    }
}

export default FileUpload;