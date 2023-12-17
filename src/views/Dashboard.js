import React, { useState, useEffect } from "react";
import ChartistGraph from "react-chartist";
import TransactionRow from "components/TransactionRow";
import DashboardBar from "components/DashboardBar"
import LineChartDashboard from "components/LineChartDashboard"
import { getOverview } from "API";
import OverviewGoalsRow from "components/OverviewGoalsRow";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  PieChart  from "../components/PieChart";
var moment = require('moment');

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  Form
} from "react-bootstrap";
import { deleteTransaction } from "API";

function Dashboard() {

  const notifySuccess = (message) => toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  const notifyFailure = () => toast.error("An Error Occured", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const [data, setData] = useState({});
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
  const [categoricalData,setCategoricalData]=useState([])
  const [barChartData,setBarChartData]=useState([])
  
  const IncomeTime = moment(data.monthlyIncomeDate).format('DD') 
  const TimeNow = moment().format('DD')
  let diff = TimeNow-IncomeTime
  if(diff<0){
    diff = 30-(Math.abs((IncomeTime-TimeNow)))
  }

  const getData = async () => {
    await getOverview().then(res => {
      console.log(res.data)
      setData(res.data)
    }).catch(e => {
      console.log(e.message)
    })
  }
  const deleteTrans = async (id) => {
    const data = { transaction_id: id }
    deleteTransaction(data).then(async res => {
      notifySuccess("Successfully Deleted")
      await getData()
    }).catch(e => notifyFailure())
  }
  const categoryInfo=()=>{
    
    let info=[]
    let transactions=data.transactions
    if(transactions){
    let categories=["Entertainment","Food","Shopping","Grocery","Transport","Home utility","Miscellaneous"]
    for(let cat of categories){
      let obj={}
      obj.amount=transactions.filter((el)=>el.category===cat).reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);
      obj.category=cat
      info.push(obj)
    }
    setCategoricalData(info)
  }
  }
const abc=()=>{
  const transactionData = data.transactions
  
  const categories = ["Entertainment", "Food", "Shopping", "Grocery", "Transport", "Home utility", "Miscellaneous"];
  const transformAndOrderData = (data) => {
    const transformedData = [];
  
    // Create a map to store monthly totals
    const monthlyTotals = new Map();
    if(data){
    // Process each transaction
    data.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYearKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  
      // Initialize the monthly total if it doesn't exist
      if (!monthlyTotals.has(monthYearKey)) {
        monthlyTotals.set(monthYearKey, { duration: monthYearKey, totalAmount: 0 });
        // Initialize individual category amounts
        categories.forEach(category => {
          monthlyTotals.get(monthYearKey)[`${category}CategoryAmount`] = 0;
        });
      }
  
      // Add the amount to the total for the month
      monthlyTotals.get(monthYearKey).totalAmount += transaction.amount;
  
      // Add the amount to the category total for the month based on category
      monthlyTotals.get(monthYearKey)[`${transaction.category}CategoryAmount`] += transaction.amount;
    });
  
    // Convert the map values to an array and sort by date
    transformedData.push(...monthlyTotals.values());
    transformedData.sort((a, b) => new Date(a.duration) - new Date(b.duration));
  
    return transformedData;
  }
  };
  
  // Call the transformAndOrderData function with your transaction data
  const result = transformAndOrderData(transactionData);
  
  // Display the result
  console.log(result);
  setBarChartData(result)
}

  useEffect(() => {
    getData()
  }, [])
  useEffect(()=>{
    categoryInfo()
    abc()
  },[data])

  return (
    <>
      <ToastContainer />
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-chart text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Amount Spent </p>
                      <Card.Title as="h4">₹ {data.totalAmountSpent}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Till Now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-light-3 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Monthly Income</p>
                      <Card.Title as="h4">₹ {data.monthlyIncome}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Till Now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">No. of Transactions</p>
                      <Card.Title as="h4">{data.transactionsCount}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i class="far fa-money-bill-alt mr-1"></i>
                  Till Now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Recurring Payments</p>
                      <Card.Title as="h4">{data.recurringCount}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i class="far fa-money-bill-alt mr-1"></i>
                  Till Now
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Recent Transactions</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">Serial No.</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Amount</th>
                      <th className="border-0">Category</th>
                      <th className="border-0">Mode of Payment</th>
                      <th className="border-0">Date</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentTransactions?.map((transaction, index) => {
                      return (
                        <TransactionRow
                          key={index}
                          sNo={index+1}
                          name={transaction.name}
                          amount={transaction.amount}
                          category={transaction.category}
                          date={transaction.date}
                          paymentMode={transaction.paymentMode}
                          deleteTransaction={deleteTrans}
                          _id={transaction._id}
                        />
                      )
                    })

                    }
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">

            <Card>
              <Card.Header>
                <Card.Title as="h4">Categories</Card.Title>
                <p className="card-category">Last Campaign Performance</p>
              </Card.Header>
              <Card.Body style={{padding:0}}>
                <div
                  style={{width:"100%",height:"300px"}}
                  
                >
                  {/* <ChartistGraph
                    data={{
                      labels: categoricalData.map((el)=>el.category),
                      series: categoricalData.map((el)=>el.amount),
                    }}
                    type="Pie"
                  /> */}
                  <PieChart data={categoricalData}/>
                </div>
          
              </Card.Body>
            </Card>

          </Col>
        </Row>
        <Row>
        <Col md="4">
            <Card className="card-tasks" style={{minHeight:"45%"}} >
              <Card.Header>
                <Card.Title as="h4">Goals</Card.Title>
                <p className="card-category">Tickmark for completed ones</p>
              </Card.Header>
              <Card.Body>
                <div className="table-full-width">
                  <Table>
                    <tbody>
                      {data.goals?.map((goal, index) => {
                        return <OverviewGoalsRow
                          goal={goal.goal}
                        />
                      })}

                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="now-ui-icons loader_refresh spin"></i>
                  Updated 3 minutes ago
                </div>
              </Card.Footer>
            </Card>
            <Card style={{minHeight:"45%"}}>
              <Card.Header >
                <Card.Title as="h4">Time Until Next Cycle</Card.Title>
                <p className="card-category">All products including Taxes</p>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-clock">
                      <i className="nc-icon nc-chart text-clock"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <Card.Title as="h4">{diff} Day(s) Left </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
            <Col md="8">
              <Card>
                <Card.Header>
                  <Card.Title>
                    <h3>Time Series Data</h3>
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <div style={{height:"500px"}}>
                    <DashboardBar data={barChartData}/>
                  </div>
                  
                </Card.Body>

              </Card>
                  
            </Col>
          
           
        </Row>
        <Row>
        <Col md="8">
              <Card>
                <Card.Header>
                  <Card.Title>
                    <h3>Time Series Data</h3>
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <div style={{height:"500px"}}>
                    <LineChartDashboard data={barChartData}/>
                  </div>
                  
                </Card.Body>

              </Card>
                  
            </Col>
          <Col md="4">
          <Card className="card-tasks" style={{height:"95%"}}>
              <Card.Header>
                <Card.Title as="h4">Limits</Card.Title>
                <p className="card-category">Limits Set for various categories </p>
              </Card.Header>
              <Card.Body>
                      <div style={{padding:"25px"}}>
                        {data.limits && data.limits.map((el)=>{
                          return (
                            <div>
                              <Card.Title>{el.category}</Card.Title>
                              {
                                el.limits.map((el2)=>{
                                  return(
                                    <div style={{marginLeft:"25px"}}>
                                      <li>
                                      {el2.duration}: {el2.amount}
                                      </li>
                                    </div>
                                
                                         
                                     
                                  )
                                })
                              }
                              <hr></hr>
                            </div>
                          )
                        })}
                      </div>
              </Card.Body>
              <Card.Footer>
                
                <div className="stats">
                  <i className="now-ui-icons loader_refresh spin"></i>
                  Updated 3 minutes ago
                </div>
              </Card.Footer>
            </Card>
          </Col>
          
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
