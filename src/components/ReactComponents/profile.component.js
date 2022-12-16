import React, {Component} from "react";
import {Navigate} from "react-router-dom";
import AuthService from "../Service/auth.service";
import '../assets/fonts/font-awesome.min.css';
import '../assets/bootstrap/css/bootstrap.min.css';
import "../staticFilesCss/formsStyle.css"
import '../assets/fonts/fontawesome-all.min.css';
import {NavBarComponent} from "./navBar.component"
import FileUpload from "./fileUpload.component";
import EventBus from '../../common/EventBus'
import axios from "axios";
import authHeader from "../Service/auth-header";
import {VictoryArea, VictoryBar, VictoryChart, VictoryClipContainer, VictoryHistogram, VictoryTheme} from "victory";
import {Chart} from "react-google-charts";
import merge from "validator/es/lib/util/merge";
import {VictoryLine} from "victory";
import ReactWordcloud from "react-wordcloud";



export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      trueSentiments:[],
      wordStatistics:[],
      positivePercent:'',
      negativePercent:'',
      NeutralPercent:''

    };
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
          localStorage.setItem('sents',JSON.stringify(trueSentiments))
        })
  }

  getWords(){
    let url="http://localhost:8060/api/sentiment/getCommonWords";
    axios.get(url)
        .then(res=>{
          let wordStatistics;
          wordStatistics=res.data;
          console.log(wordStatistics)
          this.setState({
            wordStatistics:wordStatistics,
          });
          localStorage.setItem('words',JSON.stringify(wordStatistics))
        })
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      this.setState({
        showAdminTable: currentUser.roles.includes("ROLE_ADMIN"),
      });
    }
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })

    EventBus.on("logout", () => {
      this.logOut();
    });



  }
  componentWillUnmount() {
    EventBus.remove("logout");
  }

    logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  positiveCounts(){
    let count=0
    const data=this.state.trueSentiments
    for (const elem of data){
      if(elem.sentiment.sentiment==="POSITIVE"){
        count +=1
      }
    }

    return count
  }


  neutralCounts(){
    let count=0
    const data=this.state.trueSentiments
    for (const elem of data){
      if(elem.sentiment.sentiment==="NEUTRAL"){
        count +=1
      }
    }
    return count
  }

  negativeCounts(){
    let count=0
    const data=this.state.trueSentiments
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

    exportUserInfo() {

    let urlLink = "http://localhost:8060/api/sentiment/export";
    axios.post(urlLink, this.state.trueSentiments, {headers: authHeader()}).
    then(res  =>{
      const blob = new Blob([res.data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "sentiment-report.txt";
      link.href = url;
      link.click();
        }
    )
  }

  render() {


    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    const negative=this.negativeCounts()
    const positive=this.positiveCounts()
    const neutral=this.neutralCounts()
    const word=this.state.wordStatistics
    const dataAmount=this.state.trueSentiments
    const { currentUser } = this.state;


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


    console.log(resSentiment)

    console.log(dataAmount)

    const entityKey="iphone"
    const entityIphoneFilter=dataAmount.filter(obj=>obj.entities.find(e => e.name.toLowerCase().includes(entityKey)))
    console.log(entityIphoneFilter)

    const entityKeyForSamsung="samsung"
    const entitySamsungFilter=dataAmount.filter(obj=>obj.entities.find(e => e.name.toLowerCase().includes(entityKeyForSamsung)))

    const negativeFilter=dataAmount.filter(obj=>obj.sentiment.sentiment ==='NEGATIVE')
    console.log(negativeFilter)
    const negativeFilterByPolarity=negativeFilter.filter(obj=>obj.sentiment.polarity>=0.985)
    console.log(negativeFilterByPolarity)
    const positiveFilter=dataAmount.filter(obj=>obj.sentiment.sentiment ==='POSITIVE')
    console.log(positiveFilter)
    const positiveFilterByPolarity=negativeFilter.filter(obj=>obj.sentiment.polarity>=0.985)
    console.log(positiveFilterByPolarity)


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
      sliceVisibilityThreshold:0.01,
      fontName: 'Chocolate cyr-lat'
    };
    const optionsForIphone = {
      title: "Iphone Sentiment",
      pieHole: 0.8,
      is3D: true,
      fontName: 'Chocolate cyr-lat'
    };

    const optionsForSamsung = {
      title: "Samsung Sentiment",
      pieHole: 0.8,
      is3D: true,
      fontName: 'Chocolate cyr-lat'
    };

    const size = [200,200];

    const optionsForWords = {
      colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
      enableTooltip: true,
      deterministic: false,
      fontFamily: "impact",
      fontSizes: [5, 60],
      fontStyle: "normal",
      fontWeight: "normal",
      padding: 1,
      rotations: 3,
      rotationAngles: [0, 90],
      scale: "sqrt",
      spiral: "archimedean",
      transitionDuration: 1000
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
      slices: {0: {color: 'green'}, 2: {color: 'red'},3:{color:'yellow'}},
      fontName: 'Chocolate cyr-lat'

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

    console.log(dataForIphoneChart)




    console.log(dataForAllEntities)
    console.log(word)


    const leftSide = (
        <div id="wrapper" class="specialDiv">
      <NavBarComponent> </NavBarComponent>
          <div class="d-flex flex-column" id="content-wrapper">
            <div id="content" class="specialDiv">
              <nav class="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
                <div class="container-fluid" style={{backgroundColor:"grey"}} >
                  <div class="col">
                  <button class="btn btn-link d-md-none rounded-circle me-3" id="sidebarToggleTop" type="button">
                    <i class="fas fa-bars"/></button>
                  <a className="container-button" role="button"
                     onClick={() => this.getSentiments()}>
                    <i className="fas fa-download fa-sm text-white-50"/>
                    &nbsp;Show Data</a>
                    <a className="container-button" role="button"
                       onClick={() => this.getWords()}>
                      <i className="fas fa-download fa-sm text-white-50"/>
                      &nbsp;Word Statistics</a>
                    <a className="container-button" role="button"
                       onClick={() => this.exportUserInfo()}>
                      <i className="fas fa-download fa-sm text-white-50"/>
                      &nbsp;Export Data</a>
                  </div>
                  <span className="container-button">{currentUser.username}</span>
                  <div class="nav-item dropdown no-arrow"><a class="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#"/>
                    </div>
                  <a href="/login" class="container-button" role="button"  onClick={this.logOut}>LogOut</a>
            </div>
          </nav>
          <div class="container-fluid">
          <FileUpload/>
            <div class="row">
              <div class="col-md-6 col-xl-3 mb-4">
                <div class="card shadow border-start-primary py-2">
                  <div class="card-body">
                    <div class="row align-items-center no-gutters">
                      <div class="col me-2">
                        <div class="text-uppercase text-primary fw-bold text-xs mb-1"><span>DATA HANDLED for last analysis</span></div>
                        <div class="text-dark fw-bold h5 mb-0"><span>{dataAmount.length}</span></div>
                      </div>
                      <div class="col-auto"><i class="fas fa-comments fa-2x text-gray-300"/></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3 mb-4">
                <div class="card shadow border-start-success py-2" style={{fontFamily: 'Chocolate cyr-lat'}}>
                  <div class="card-body">
                    <div class="row align-items-center no-gutters">
                      <div class="col me-2">
                        <div class="text-uppercase text-success fw-bold text-xs mb-1"><span>positive sentiments</span></div>
                        <div class="text-dark fw-bold h5 mb-0"><span>
                          {positive}
                        </span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3 mb-4" style={{fontFamily: 'Chocolate cyr-lat'}}>
                <div class="card shadow border-start-warning py-2">
                  <div class="card-body">
                    <div class="row align-items-center no-gutters">
                      <div class="col me-2">
                        <div class="text-uppercase text-danger fw-bold text-xs mb-1"><span>NEGATIVE SENTIMENTS</span></div>
                        <div class="text-dark fw-bold h5 mb-0"><span>{negative}</span></div>
                      </div>
                      <div class="col-auto"><i class="fas fa-comments fa-2x text-gray-300"/></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3 mb-4" style={{fontFamily: 'Chocolate cyr-lat'}}>
                <div class="card shadow border-start-warning py-2">
                  <div class="card-body">
                    <div class="row align-items-center no-gutters">
                      <div class="col me-2">
                        <div class="text-uppercase text-warning fw-bold text-xs mb-1"><span>neutral sentiments</span></div>
                        <div class="text-dark fw-bold h5 mb-0"><span>{neutral}</span></div>
                      </div>
                      <div class="col-auto"><i class="fas fa-comments fa-2x text-gray-300"/></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
                <div class="card-header d-flex justify-content-between align-items-center">
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
                  <Chart
                      chartType="PieChart"
                      width="100%"
                      height="400px"
                      data={dataForSamsungChart}
                      options={optionsForSamsung}
                  />
                </div>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Most Common words</h2>
              <VictoryChart
                  theme={VictoryTheme.material}
                  domain={{ x: [1, 14], y: [50, 500] }}
                  height={500}
                  width={1000}
                  domainPadding={{ x: 20,y:20 }}
              >
                <VictoryArea
                    groupComponent={<VictoryClipContainer clipPadding={{ top: 5, right: 10 }}/>}
                    style={{ data: { stroke: "#c43a31", strokeWidth: 10, strokeLinecap: "round" } }}
                    data={word}
                    x="text"
                    y="value"
                />
              </VictoryChart>
              <h2>Most common entities</h2>
              <VictoryChart
                  theme={VictoryTheme.material}
                  domain={{ x: [1, 14], y: [5, 100] }}
                  height={500}
                  width={1000}
                  domainPadding={{ x: 1,y:20 }}
              >
                <VictoryLine
                    style={{
                      data: { stroke: "#c43a31" },
                      parent: { border: "1px solid #ccc"}
                    }}
                    data={occData}
                    x="name"
                    y="occurrence"
                    interpolation={2}/>
              </VictoryChart>
              <h2>Word Cloud</h2>
              <ReactWordcloud words={word} size={size} options={optionsForWords}/>
            </div>
            <div className="card-header d-flex justify-content-between align-items-center">
            <VictoryChart
                theme={VictoryTheme.material}
                domain={{ x: [1, 14]  , y: [5, 100] }}
                height={500}
                width={1200}
                domainPadding={{ x: 2,y:2 }}
            >
              <VictoryBar horizontal
                  style={{ data:
                        { fill: "#c43a31",width: 30}
                  }}

                  data={occData}
                  x={"name"}
                  y={"occurrence"}
              />
            </VictoryChart>
            </div>
          </div>
        </div>
        </div>
        </div>

    );
    return (
       leftSide
    );
  }
}
