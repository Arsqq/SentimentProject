import React, { Component } from "react";
import { Navigate } from "react-router-dom";
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
import {VictoryBar, VictoryPie, VictorySharedEvents} from "victory";
import ReactWordcloud from 'react-wordcloud';


function VictoryLabel(props: { y: number }) {
  return null;
}

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      trueSentiments:[],
      wordStatistics:'',
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
          this.setState({
            wordStatistics:wordStatistics,
          });
          localStorage.setItem('words',JSON.stringify(wordStatistics))
        })
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

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
      showModeratorBoard: false,
      showAdminBoard: false,
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
    console.log(word)

    const leftSide = (
        <div id="wrapper" class="specialDiv">
      <NavBarComponent> </NavBarComponent>
          <div class="d-flex flex-column" id="content-wrapper">
            <div id="content" class="specialDiv">
              <nav class="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
                <div class="container-fluid">
                  <div class="col">
                  <button class="btn btn-link d-md-none rounded-circle me-3" id="sidebarToggleTop" type="button">
                    <i class="fas fa-bars"/></button>
                  <a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button"
                     onClick={() => this.getSentiments()}>
                    <i className="fas fa-download fa-sm text-white-50"/>
                    &nbsp;Show Data</a>
                    <a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button"
                       onClick={() => this.getWords()}>
                      <i className="fas fa-download fa-sm text-white-50"/>
                      &nbsp;Word Statistics</a>
                  </div>
                  <li class="nav-item dropdown no-arrow">
                    <div class="nav-item dropdown no-arrow"><a class="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#">
                      <span class="d-none d-lg-inline me-2 text-gray-600 small">{currentUser.username}</span></a>
                      <div class="dropdown-menu shadow dropdown-menu-end animated--grow-in">
                        <a class="dropdown-item" href="#">
                        <i class="fas fa-user fa-sm fa-fw me-2 text-gray-400"/>&nbsp;Profile</a><a class="dropdown-item" href="#">
                        <i class="fas fa-cogs fa-sm fa-fw me-2 text-gray-400"/>&nbsp;Settings</a><a class="dropdown-item" href="#">
                        <i class="fas fa-list fa-sm fa-fw me-2 text-gray-400"/>&nbsp;Activity log</a>
                        <div class="dropdown-divider"/>
                        <a class="dropdown-item"  href="/login" onClick={this.logOut}>
                          <i class="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400">
                          </i>&nbsp;Logout</a>
                      </div>
                    </div>
                  </li>
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
                <div class="card shadow border-start-success py-2">
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
              <div class="col-md-6 col-xl-3 mb-4">
                <div class="card shadow border-start-warning py-2">
                  <div class="card-body">
                    <div class="row align-items-center no-gutters">
                      <div class="col me-2">
                        <div class="text-uppercase text-warning fw-bold text-xs mb-1"><span>NEGATIVE SENTIMENTS</span></div>
                        <div class="text-dark fw-bold h5 mb-0"><span>{negative}</span></div>
                      </div>
                      <div class="col-auto"><i class="fas fa-comments fa-2x text-gray-300"/></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-xl-3 mb-4">
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
              <div class="card shadow mb-4"/>
              <div class="card shadow mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <svg viewBox="30 20 900 240">
                    <VictorySharedEvents
                        events={[{
                          childName: ["pie", "bar"],
                          target: "data",
                          eventHandlers: {
                            onMouseOver: () => {
                              return [{
                                childName: ["pie", "bar"],
                                mutation: (props) => {
                                  return {
                                    style: Object.assign({}, props.style, {fill: "tomato"})
                                  };
                                }
                              }];
                            },
                            onMouseOut: () => {
                              return [{
                                childName: ["pie", "bar"],
                                mutation: () => {
                                  return null;
                                }
                              }];
                            }
                          }
                        }]}
                    >
                      <g transform={"translate(150, 50)"}>
                        <VictoryBar name="bar"
                                    width={300}
                                    standalone={false}
                                    style={{
                                      data: { width: 20 },
                                      labels: {fontSize: 25}
                                    }}
                                    data={[
                                      {x: "a", y: 2}, {x: "b", y: 3}, {x: "c", y: 5}, {x: "d", y: 4}
                                    ]}
                                    labels={["a", "b", "c", "d"]}
                                    labelComponent={<VictoryLabel y={290}/>}
                        />
                      </g>
                      <g transform={"translate(0, -75)"}>
                        <VictoryPie name="pie"
                                    width={250}
                                    standalone={false}
                                    style={{ labels: {fontSize: 25, padding: 10}}}
                                    data={[
                                      {x: "a", y: 1}, {x: "b", y: 4}, {x: "c", y: 5}, {x: "d", y: 7}
                                    ]}
                        />
                      </g>
                    </VictorySharedEvents>
                  </svg>
                </div>
              </div>
            <ReactWordcloud
                words={word}
            />
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
