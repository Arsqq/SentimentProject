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
        console.log("Hi")
        axios.post("http://localhost:5000/tweets", this.state.searchValue)
            .then((res) => {
                console.log(res.data)
                this.setState({
                    tweets:res.data
                })
            });
    }

    click(){
        console.log("hi")
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

        console.log(resEntities)

        const resSentiment = dataAmount.reduce((acc, curr) => {
            if(!acc) {
                acc = [curr.sentiment]
            } else {
                acc = acc.concat(curr.sentiment);
            }

            return acc;
        }, [])

        const akk=merge(resEntities,resSentiment)
        console.log(akk)
        console.log(resSentiment)

        console.log(dataAmount)


        const entityKey=this.state.searchValue
        console.log(entityKey)
        const entityIphoneFilter=dataAmount.filter(obj=>obj.entities.find(e => e.name.toLowerCase().includes(entityKey)))
        console.log(entityIphoneFilter)

        const entityKeyForSamsung="samsung"
        const entitySamsungFilter=dataAmount.filter(obj=>obj.entities.find(e => e.name.toLowerCase().includes(entityKeyForSamsung)))



        const sentimentsForIphone=entityIphoneFilter.reduce((acc, curr) => {
            if(!acc) {
                acc = [curr.sentiment]
            } else {
                acc = acc.concat(curr.sentiment);
            }

            return acc;
        }, [])

        const sentimentForSamsung=entitySamsungFilter.reduce((acc, curr) => {
            if(!acc) {
                acc = [curr.sentiment]
            } else {
                acc = acc.concat(curr.sentiment);
            }

            return acc;
        }, [])


        const afterFilter = resEntities.filter(el => el.type !== 'PERSON' && el.type !== 'DATE' && el.type !=='PERCENT'
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


        function positiveSamsungCounts(){
            let count=0
            for (const elem of sentimentForSamsung){
                if(elem.sentiment==="POSITIVE"){
                    count +=1
                }
            }
            return count
        }
        function neutralSamsungCounts(){
            let count=0
            for (const elem of sentimentForSamsung){
                if(elem.sentiment==="NEUTRAL"){
                    count +=1
                }
            }
            return count
        }
        function negativeSamsungCounts(){
            let count=0
            for (const elem of sentimentForSamsung){
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

        const dataForSamsungChart=[
            ["Polarity", "Count"],
            ["Positive", positiveSamsungCounts()],
            ["Negative", negativeSamsungCounts()],
            ["Neutral", neutralSamsungCounts()],
        ];



        return (
            <div id="wrapper">
                <NavBarComponent> </NavBarComponent>
                <div class="col">
                    <form class="my-form2">
                        <input type="text" value={this.state.searchValue} class="form-input2" onChange={this.onChange}/>
                        <button type="button" className="button-custom2" onClick={() =>this.onSubmit()}>Submit</button>
                    </form>
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
                        <VictoryChart
                            theme={VictoryTheme.material}
                            domain={{x: [1, 6], y: [2, 200]}}
                            height={300}
                            domainPadding={{x: 20, y: 20}}
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
        );
    }
}

export default TweetsComponent;
