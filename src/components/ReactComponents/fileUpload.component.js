import React from 'react'
import axios from 'axios';
import authHeader from "../Service/auth-header";

class FileUpload extends React.Component{
    constructor(){
        super();
        this.state = {
            selectedFile:'',
            sentiments:[],
            trueSentiments:[],
        }
        this.submit = this.submit.bind(this);



        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            selectedFile: event.target.files[0],
        })
    }

    submit(){
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        console.warn(this.state.selectedFile);
        let url = "http://localhost:8060/api/sentiment/uploadFile";
        let urlFlask="http://localhost:5000/sentiment";
        axios.post(urlFlask, data, {headers:authHeader()})
            .then(res => { // then print response status
                let sentiments;
                sentiments=res.data
                console.log(sentiments)
                console.warn(res);
                this.setState({
                    sentiments:sentiments,
                });
            })

    }



    getSentiments(){
        let url="http://localhost:8060/api/sentiment/getSentimentList";
        axios.get(url,{headers:authHeader()})
            .then(res=>{
                let trueSentiments;
                trueSentiments=res.data;
                console.log(trueSentiments)
                this.setState({
                    trueSentiments:trueSentiments,
                });
            })

    }

    render(){
        const resultSentiments=this.state.sentiments
        const trueSentiments=this.state.trueSentiments
        return(
            <div class="d-sm-flex justify-content-between align-items-center mb-4">
                    <input type="file" class="btn btn-primary btn-sm d-none d-sm-inline-block" name="upload_file" onChange={this.handleInputChange} />
                <h3 class="text-dark mb-0">Dashboard</h3>
                <a class="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" onClick={()=>this.submit()}>
                    <i class="fas fa-download fa-sm text-white-50"/>
                    &nbsp;Upload</a>
                    {trueSentiments.map((data,index) => (
                        <li key={index}>
                            <p>{data.sentiment.sentiment},{data.sentiment.polarity}</p>
                            {data.entities.map((ent, index) => {
                                return (
                                    <div key={index}>
                                        <p>{ent.name}</p>
                                        <p>{ent.type}</p>
                                    </div>
                                );
                            })}
                        </li>
                    ))}
            </div>
        )
    }
}

export default FileUpload;