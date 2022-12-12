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


export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      trueSentiments:[],
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
    const dataAmount=this.state.trueSentiments
    const { currentUser } = this.state;
    const leftSide = (
        <div id="wrapper" class="specialDiv">
      <NavBarComponent> </NavBarComponent>
          <div class="d-flex flex-column" id="content-wrapper">
            <div id="content" class="specialDiv">
              <nav class="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
                <div class="container-fluid">
                  <button class="btn btn-link d-md-none rounded-circle me-3" id="sidebarToggleTop" type="button">
                    <i class="fas fa-bars"/></button>
                  <a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button"
                     onClick={() => this.getSentiments()}>
                    <i className="fas fa-download fa-sm text-white-50"/>
                    &nbsp;Show Data</a>
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
                        <div class="text-uppercase text-primary fw-bold text-xs mb-1"><span>DATA HANDLED for last analysis)</span></div>
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
                        <div class="text-uppercase text-success fw-bold text-xs mb-1"><span>positive sentiments)</span></div>
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
                        <div class="text-uppercase text-warning fw-bold text-xs mb-1"><span>NEGATIVE CENTIMENTS</span></div>
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
            <div class="col-lg-7 col-xl-8">
              <div class="card shadow mb-4"/>
              <div class="card shadow mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h6 class="text-primary fw-bold m-0">s</h6>
                  <div class="chart-area"><canvas data-bss-chart="{&quot;type&quot;:&quot;doughnut&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;Direct&quot;,&quot;Social&quot;,&quot;Referral&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;&quot;,&quot;backgroundColor&quot;:[&quot;#df4e4e&quot;,&quot;#1cc88a&quot;,&quot;#36b9cc&quot;],&quot;borderColor&quot;:[&quot;#ffffff&quot;,&quot;#ffffff&quot;,&quot;#ffffff&quot;],&quot;data&quot;:[&quot;70&quot;,&quot;20&quot;,&quot;10&quot;]}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:false,&quot;legend&quot;:{&quot;display&quot;:false,&quot;labels&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;}},&quot;title&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;}}}"/></div>
                  <div class="dropdown no-arrow"><button class="btn btn-link btn-sm dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button"><i class="fas fa-ellipsis-v text-gray-400"></i></button>
                    <div class="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                      <p class="text-center dropdown-header">dropdown header:</p><a class="dropdown-item" href="#">&nbsp;Action</a><a class="dropdown-item" href="#">&nbsp;Another action</a>
                      <div class="dropdown-divider"/><a class="dropdown-item" href="#">&nbsp;Something else here</a>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <div class="text-center small mt-4"><span class="me-2"><i class="fas fa-circle text-primary"/>&nbsp;Negative</span><span class="me-2"><i class="fas fa-circle text-success"></i>Positive</span><span class="me-2"><i class="fas fa-circle text-info"></i>&nbsp;Neutral</span></div>
                </div>
              </div>
            </div>
            <div class="col">
              <div><canvas data-bss-chart="{&quot;type&quot;:&quot;bar&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;Hi&quot;,&quot;Hello&quot;,&quot;Wow&quot;,&quot;Awesome&quot;,&quot;cringe&quot;,&quot;awful&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;Revenue&quot;,&quot;backgroundColor&quot;:&quot;#4e73df&quot;,&quot;borderColor&quot;:&quot;#4e73df&quot;,&quot;data&quot;:[&quot;491&quot;,&quot;1000&quot;,&quot;1200&quot;,&quot;3000&quot;,&quot;5434&quot;,&quot;6000&quot;]}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:true,&quot;legend&quot;:{&quot;display&quot;:false,&quot;labels&quot;:{&quot;bold&quot;:false,&quot;italic&quot;:false,&quot;fontStyle&quot;:&quot;normal&quot;}},&quot;title&quot;:{&quot;fontStyle&quot;:&quot;bold&quot;}}}"/></div>
            </div>
          </div>
        </div>
        </div><a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a>
        </div>
    );
    return (
       leftSide
    );
  }
}
