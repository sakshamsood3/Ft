import { getCategoryTransactions } from 'API';
import React, { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup';


import {
  Badge,
  Button,
  Card,
  Form,
  ProgressBar,
} from "react-bootstrap";
import { ListGroupItem } from 'reactstrap';
var moment = require('moment');


export default function Limits(props) {
const [categoryInfo,setCategoryInfo]=useState([])
const filterLastWeek = (transactions) => {
    // const lastWeek = new Date();
    // lastWeek.setDate(lastWeek.getDate() - 7);    
    // return transactions && transactions.filter(transaction => new Date(transaction.date) > lastWeek).reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Start of the week is Monday

    return transactions && transactions.filter(transaction => new Date(transaction.date) >= startOfWeek).reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);
  }
  
  // Function to filter transactions for the last month
  const filterLastMonth = (transactions) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  
    return transactions && transactions.filter(transaction => new Date(transaction.date) >= startOfMonth).reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);
  };
  
  // Function to filter transactions for the last year
  const filterLastYear = (transactions) => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    return transactions && transactions.filter(transaction => new Date(transaction.date) >= startOfYear).reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);
  };
  const currentDate = new Date();

  const getDaysLeft=(duration)=>{
    console.log(duration)
    if(duration.toLowerCase()==="weekly"){
        return 7 - currentDate.getDay()
    }else if(duration.toLowerCase()==="monthly"){
        const daysInCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        return daysInCurrentMonth - currentDate.getDate();
    }else if(duration.toLowerCase()==="yearly"){
        const daysInCurrentYear = new Date(currentDate.getFullYear() + 1, 0, 0).getTime() - currentDate.getTime();
        return Math.ceil(daysInCurrentYear / (1000 * 60 * 60 * 24));
    }
  }

const getTransactions=async () => {
    await getCategoryTransactions({category:props.category}).then((res)=>{
        setCategoryInfo(res.data)
    }).catch(e => console.log(e.message))
    
}
useEffect(()=>{
    getTransactions()
},[])


const percentage = parseInt((props.currentAmount) / (props.targetAmount) * 100);



const mapping={
    "weekly":filterLastWeek,
    "monthly":filterLastMonth,
    "yearly":filterLastYear,
}

 
  return (
    <>
      <Card >
        <Card.Header>
          <Card.Title as="h3" >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{props.category}
              </div>

            </div>
          </Card.Title>
        </Card.Header>
        
            <ListGroup className="list-group-flush">
                {
                    props.limits.map((lim)=>{
                        let currentSpending=(mapping[lim.duration.toLowerCase()](categoryInfo.transactions))
                        let targetAmount=lim.amount
                        let daysLeft=getDaysLeft(lim.duration)
                        const percentage = parseInt((currentSpending) / (targetAmount) * 100);
                        const barColor = currentSpending>=targetAmount ? "danger" : "success";
                        return (
                        
                            <ListGroupItem>
                                <div style={{width:"100%"}}>
                                {lim.duration} 
                                <Button className="mx-2 btn btn-xs btn-fill">{daysLeft} Days Left</Button>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px" }}>
                                        <div>
                                        <span style={{ color: "green" }}> Currently Spent: {currentSpending} </span>
                                        </div>
                                        <div>
                                        <span style={{ color: "red" }}> Limit Amount: {targetAmount}</span>
                                        </div>
                                    </div>
                                    <div className="progressBar my-1" style={{ fontSize: "15px" }}>
                                        <ProgressBar animated variant={barColor} now={percentage} label={`${percentage}% completed`} />
                                    </div>
                                </div>
                                <Button className="btn btn-sm btn-fill mx-1 btn-danger" style={{marginLeft:"auto"}} onClick={() => props.deleteOneLimit({category:props.category,lim_id:lim._id})}>Delete Limit</Button>

                                </div>
                            
                            </ListGroupItem>
                        )
                    })
                }
            </ListGroup>
       

        
      </Card>
    </>
  )
}
