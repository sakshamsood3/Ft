import React, { useState, useEffect } from "react";
import { getLimit, setLimit,getTransaction} from "API";
import Limits from "../components/Limits";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { Oval } from  'react-loader-spinner'
import Table from 'react-bootstrap/Table';
import PredictionBarChart from '../components/PredictionBarChart'
var moment = require('moment');
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  ProgressBar,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { deleteLimit } from "API";


function Maps() {
    const [transactions,setTranscations]=useState([])
    const [loadingWeekly,setLoadingWeekly]=useState(false)
    const [loadingMonthly,setLoadingMonthly]=useState(false)
    const [weeklyPred,setWeeklyPred]=useState([
        {
          "category": "Entertainment",
          "amount": 1435.40234375
        },
        {
          "category": "Food",
          "amount": 1063.55078125
        },
        {
          "category": "Grocery",
          "amount": 1344.2750244140625
        },
        {
          "category": "Home utility",
          "amount": 1274.8441162109375
        },
        {
          "category": "Miscellaneous",
          "amount": 893.5393676757812
        },
        {
          "category": "Shopping",
          "amount": 1652.7724609375
        },
        {
          "category": "Transport",
          "amount": 1907.3192138671875
        }
      ])
    const [monthlyPred,setMonthlyPred]=useState([
        {
            "category": "Entertainment",
            "amount": 9423.3369140625
          },
          {
            "category": "Food",
            "amount": 9778.728515625
          },
          {
            "category": "Grocery",
            "amount": 9279.5380859375,
          },
          {
            "category": "Home utility",
            "amount":  11192.8349609375,
          },
          {
            "category": "Miscellaneous",
            "amount": 8810.09765625,
          },
          {
            "category": "Shopping",
            "amount": 7833.2001953125,
          },
          {
            "category": "Transport",
            "amount": 10056.5029296875
          }
   
    ])

  const notifySuccess = (message) => toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
  const notifyFailure = ()=>toast.error("An Error Occured", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
    const fetchData = async () => {
        await getTransaction().then(res => {
          console.log(res.data)
          setTranscations(res.data)
        }).catch(e => {
          console.log(e.message)
        })
      }
    const fetchWeeklyPredictions=async ()=>{
        setLoadingWeekly(true)
        try{
        await fetchData();
            let finalTransactions=transactions
        // function sortFunction(a,b){  
        //     var dateA = new Date(a.date).getTime();
        //     var dateB = new Date(b.date).getTime();
        //     return dateA > dateB ? -1 : 1;  
        // }; 

        // const sortedTransactions = transactions.sort(sortFunction);

        
        // let finalTransactions=sortedTransactions.slice(0,200)
     
        let Dated=finalTransactions.map((el)=>{
            return(el.date.slice(0,10))
        })
        let Category=finalTransactions.map((el)=>{
            return (el.category)
        })
        let Amount=finalTransactions.map((el)=>{
            return el.amount
        })
        let data={
            Date:Dated,Category,Amount
        }
        console.log("sending request")
        let res=await axios.post('https://sakshamsood3.pythonanywhere.com/predict_future_amounts',data,{
            headers:{
                'Content-Type':'application/json'
            }
        })
        console.log(res)
      
        let final=[]
        for(let key of Object.keys(res.data)){
            let obj={}
            obj.category=key
            obj.amount=res.data[key]
            final.push(obj)
        }
        setWeeklyPred(final)
        
        setLoadingWeekly(false)
    }catch(e){
        console.log(e)
        setLoadingWeekly(false)
        notifyFailure("Something Went Wrong.Try Again Later")

    }
        
    }
    const fetchMonthlyPredictions=async ()=>{
        
        setLoadingMonthly(true)
        try{
        await fetchData();
       
        let Date=transactions.map((el)=>{
            return(el.date.slice(0,10))
        })
        let Category=transactions.map((el)=>{
            return (el.category)
        })
        let Amount=transactions.map((el)=>{
            return el.amount
        })
        let data={
            Date,Category,Amount
        }
        console.log("sending request")
        let res=await axios.post('https://sakshamsood03.pythonanywhere.com/predict_future_amounts2',data,{
            headers:{
                'Content-Type':'application/json'
            }
        })
        console.log(res)
        setLoadingMonthly(false)
        let final=[]
        for(let key of Object.keys(res.data)){
            let obj={}
            obj.category=key
            obj.amount=res.data[key]
            final.push(obj)
        }
        setMonthlyPred(final)
        
    }catch(e){
            console.log(e)
            setLoadingMonthly(false)
            notifyFailure("Something Went Wrong.Try Again Later")
        }
        
    }
    useEffect(()=>{
        fetchData()
    },[])

  return (
    <>
      <ToastContainer />
      <Container fluid>
        <Row>
          
          <Col md="12">
            <Card>
                <Card.Title>
                    <h3 style={{margin:"10px",padding:"15px"}}>
                        Weekly Expenditure Predictions
                    </h3>
                </Card.Title>
                <Card.Body>
                {
                    loadingWeekly && (
                    <Col md="6"  style={{display:"flex",justifyContent:"center"}}>
                    <Oval
                    height={80}
                    width={80}
                    color="#4fa94d"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loadingWeekly'
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                    style={{
                        margin:"auto"
                    }}

                    />
                    </Col>
                    )
                }
                {
                    !loadingWeekly && (
                        <div style={{display:"flex",justifyContent:"space-evenly",alignItems:"center"}}>
                        <div style={{width:"50%"}}>
                             <Table responsive="sm">
                             <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Predicted Spenidng Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                  weeklyPred &&  weeklyPred.map((el)=>{
                                                    return (
                                                        <tr>
                                                            <td>{el.category}</td>
                                                            <td>{el.amount}</td>
                                                        </tr>
                                                    )
                                     })
                                }
                            </tbody>
                             </Table>
                        </div>
                        <div style={{width:"600px",height:"400px"}}>
                            <PredictionBarChart data={weeklyPred}/>
                        </div>
                        </div>
                    )
                }
                </Card.Body>
                <Card.Footer style={{display:"flex",justifyContent:"center"}}>
                { !loadingWeekly &&  <Button onClick={fetchWeeklyPredictions}>Get Predictions</Button>}

                </Card.Footer>
            </Card>
           
          </Col>
         
          <Col md="12">
          <Card>
                <Card.Title>
                    <h3 style={{margin:"10px",padding:"15px"}}>
                        Monthly Expenditure Predictions
                    </h3>
                </Card.Title>
                <Card.Body>
                {
                    loadingMonthly && (
                    <Col md="6"  style={{display:"flex",justifyContent:"center"}}>
                    <Oval
                    height={80}
                    width={80}
                    color="#4fa94d"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loadingWeekly'
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                    style={{
                        margin:"auto"
                    }}

                    />
                    </Col>
                    )
                }
                  {
                    !loadingMonthly && (
                        <div style={{display:"flex",justifyContent:"space-evenly",alignItems:"center"}}>
                        <div style={{width:"50%"}}>
                             <Table responsive="sm">
                             <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Predicted Spenidng Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                  monthlyPred &&  monthlyPred.map((el)=>{
                                                    return (
                                                        <tr>
                                                            <td>{el.category}</td>
                                                            <td>{el.amount}</td>
                                                        </tr>
                                                    )
                                     })
                                }
                            </tbody>
                             </Table>
                        </div>
                        <div style={{width:"600px",height:"400px"}}>
                            <PredictionBarChart data={monthlyPred}/>
                        </div>
                        </div>
                    )
                }
                
                </Card.Body>
                <Card.Footer style={{display:"flex",justifyContent:"center"}}>
                { !loadingMonthly &&  <Button onClick={fetchMonthlyPredictions}>Get Predictions</Button>}

                </Card.Footer>
            </Card>
          </Col>
          <Col>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Maps;
