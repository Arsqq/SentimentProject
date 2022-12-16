import * as React from 'react';
import {NavBarComponent} from "./navBar.component";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Component, useEffect, useState} from "react";
import axios from "axios";
import FileUpload from "./fileUpload.component";
import {Chart} from "react-google-charts";
import {VictoryArea, VictoryChart, VictoryClipContainer, VictoryLine, VictoryTheme} from "victory";
import merge from "validator/es/lib/util/merge";
import ReactWordcloud from "react-wordcloud";
import authHeader from "../Service/auth-header";

class TweetsComponent extends Component {
    constructor() {
        super();
        this.state = {
            searchValue:'',
            tweets:[]
        };
        this.onChange = this.onChange.bind(this);
    }
    onChange(event) {
        this.setState({
            searchValue: event.target.value,
        })
    }
    onSubmit(){
        axios.post("http://localhost:5000/tweets",{
            value:this.state.searchValue
        })
            .then((res) => {
                console.log(res.data)
                this.setState({
                    tweets:res.data
                })
            });
    }



    positiveCounts(){
        let count=0
        const data=this.state.tweets
        for (const elem of data){
            if(elem.sentiment.sentiment==="POSITIVE"){
                count +=1
            }
        }

        return count
    }


    neutralCounts(){
        let count=0
        const data=this.state.tweets
        for (const elem of data){
            if(elem.sentiment.sentiment==="NEUTRAL"){
                count +=1
            }
        }
        return count
    }

    negativeCounts(){
        let count=0
        const data=this.state.tweets
        for (const elem of data){
            if(elem.sentiment.sentiment==="NEGATIVE"){
                count +=1
            }
        }
        return count
    }
    findOcc(arr, key){
        let arr2 = [];

        arr.forEach((x)=>{

            // Checking if there is any object in arr2
            // which contains the key value
            if(arr2.some((val)=>{ return val[key] == x[key] })){

                // If yes! then increase the occurrence by 1
                arr2.forEach((k)=>{
                    if(k[key] === x[key]){
                        k["occurrence"]++
                    }
                })

            }else{
                // If not! Then create a new object initialize
                // it with the present iteration key's value and
                // set the occurrence to 1
                let a = {}
                a[key] = x[key]
                a["occurrence"] = 1
                arr2.push(a);
            }
        })

        return arr2
    }
    render() {

        const negative=this.negativeCounts()
        const positive=this.positiveCounts()
        const neutral=this.neutralCounts()
        const dataAmount=this.state.tweets
        const resEntities = dataAmount.reduce((acc, curr) => {
            if(!acc) {
                acc = [curr.entities]
            } else {
                acc = acc.concat(curr.entities);
            }


            return acc;
        }, [])



        const resSentiment = dataAmount.reduce((acc, curr) => {
            if(!acc) {
                acc = [curr.sentiment]
            } else {
                acc = acc.concat(curr.sentiment);
            }

            return acc;
        }, [])

        console.log(resSentiment)
        console.log(resEntities)


        const entityKey=this.state.searchValue
        const entityIphoneFilter=dataAmount.filter(obj=>obj.entities.find(e => e.name.toLowerCase().includes(entityKey)))
        console.log(entityIphoneFilter)




        const sentimentsForIphone=entityIphoneFilter.reduce((acc, curr) => {
            if(!acc) {
                acc = [curr.sentiment]
            } else {
                acc = acc.concat(curr.sentiment);
            }

            return acc;
        }, [])



        const afterFilter = resEntities.filter(el => el.type !== 'DATE' && el.type !=='PERCENT'
            && el.type !=='CARDINAL' && el.type !=='NORP' && el.type !=='MONEY' && el.type !=='TIME' && el.type !=='QUANTITY'
            && el.type !=='ORDINAL')
        console.log(afterFilter)

        let key="name"
        console.log(this.findOcc(afterFilter,key))

        const occData=this.findOcc(afterFilter,key)

        function positiveIphoneCounts(){
            let count=0
            for (const elem of sentimentsForIphone){
                if(elem.sentiment==="POSITIVE"){
                    count +=1
                }
            }
            return count
        }
        function neutralIphoneCounts(){
            let count=0
            for (const elem of sentimentsForIphone){
                if(elem.sentiment==="NEUTRAL"){
                    count +=1
                }
            }
            return count
        }
        function negativeIphoneCounts(){
            let count=0
            for (const elem of sentimentsForIphone){
                if(elem.sentiment==="NEGATIVE"){
                    count +=1
                }
            }
            return count
        }






        const dataForAllEntities = [
            ["Product", "Occurrence"],
            ...occData.map(el => Object.values(el))
        ];
        console.log(dataForAllEntities)




        const optionS = {
            title: "Entity Stats",
            pieHole: 0.4,
            is3D: false,
        };
        const optionsForIphone = {
            title: "Search Key Stats",
            pieHole: 0.8,
            is3D: true,
        };

        const optionsForSamsung = {
            title: "Samsung Sentiment",
            pieHole: 0.8,
            is3D: true,
        };

        const data = [
            ["Polarity", "Count"],
            ["Positive", positive],
            ["Negative", negative],
            ["Neutral", neutral],
        ];
        const options = {
            title: "Sentiment Segregation",
            pieHole: 0.4,
            is3D: false,
        };
        const dataForIphoneChart=[
            ["Polarity", "Count"],
            ["Positive", positiveIphoneCounts()],
            ["Negative", negativeIphoneCounts()],
            ["Neutral", neutralIphoneCounts()],
        ];


        return (
            <div id="wrapper" className="specialDiv">
                <NavBarComponent> </NavBarComponent>
                <div className="d-flex flex-column" id="content-wrapper">
                    <div id="content" className="specialDiv">
                        <form>
                                <input  type="text" value={this.state.searchValue} className="button-64" onChange={this.onChange}/>
                                <div className="row">
                                        <button type="button" class="button-64" onClick={() => this.onSubmit()}>Submit</button>
                            </div>
                        </form>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6 col-xl-3 mb-4">
                                    <div className="card shadow border-start-primary py-2">
                                        <div className="card-body">
                                            <div className="row align-items-center no-gutters">
                                                <div className="col me-2">
                                                    <div className="text-uppercase text-primary fw-bold text-xs mb-1">
                                                        <span>DATA HANDLED for last analysis</span></div>
                                                    <div className="text-dark fw-bold h5 mb-0">
                                                        <span>{dataAmount.length}</span></div>
                                                </div>
                                                <div className="col-auto"><i
                                                    className="fas fa-comments fa-2x text-gray-300"/></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-3 mb-4">
                                    <div className="card shadow border-start-success py-2"
                                         style={{fontFamily: 'Chocolate cyr-lat'}}>
                                        <div className="card-body">
                                            <div className="row align-items-center no-gutters">
                                                <div className="col me-2">
                                                    <div className="text-uppercase text-success fw-bold text-xs mb-1">
                                                        <span>positive sentiments</span></div>
                                                    <div className="text-dark fw-bold h5 mb-0"><span>{positive}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-3 mb-4" style={{fontFamily: 'Chocolate cyr-lat'}}>
                                    <div className="card shadow border-start-warning py-2">
                                        <div className="card-body">
                                            <div className="row align-items-center no-gutters">
                                                <div className="col me-2">
                                                    <div className="text-uppercase text-danger fw-bold text-xs mb-1">
                                                        <span>NEGATIVE SENTIMENTS</span></div>
                                                    <div className="text-dark fw-bold h5 mb-0"><span>{negative}</span>
                                                    </div>
                                                </div>
                                                <div className="col-auto"><i
                                                    className="fas fa-comments fa-2x text-gray-300"/></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-3 mb-4" style={{fontFamily: 'Chocolate cyr-lat'}}>
                                    <div className="card shadow border-start-warning py-2">
                                        <div className="card-body">
                                            <div className="row align-items-center no-gutters">
                                                <div className="col me-2">
                                                    <div className="text-uppercase text-warning fw-bold text-xs mb-1">
                                                        <span>neutral sentiments</span></div>
                                                    <div className="text-dark fw-bold h5 mb-0"><span>{neutral}</span>
                                                    </div>
                                                </div>
                                                <div className="col-auto"><i
                                                    className="fas fa-comments fa-2x text-gray-300"/></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <Chart
                                    chartType="PieChart"
                                    width="100%"
                                    height="400px"
                                    data={data}
                                    options={options}
                                />
                                <Chart
                                    chartType="PieChart"
                                    width="100%"
                                    height="400px"
                                    data={dataForAllEntities}
                                    options={optionS}
                                />
                                <Chart
                                    chartType="PieChart"
                                    width="100%"
                                    height="400px"
                                    data={dataForIphoneChart}
                                    options={optionsForIphone}
                                />
                            </div>
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h2>Most common entities</h2>
                                <VictoryChart
                                    theme={VictoryTheme.material}
                                    domain={{x: [1, 14], y: [5, 100]}}
                                    height={500}
                                    width={1000}
                                    domainPadding={{x: 1, y: 20}}
                                >
                                    <VictoryLine
                                        style={{
                                            data: {stroke: "#c43a31"},
                                            parent: {border: "1px solid #ccc"}
                                        }}
                                        data={occData}
                                        x="name"
                                        y="occurrence"
                                        interpolation={2}/>
                                </VictoryChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TweetsComponent;
