import React, { useState, useEffect } from "react";
import { getLimit, setLimit,getTransaction} from "API";
import Limits from "../components/Limits";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const [allLimits, setAllLimits] = useState([]);

  const [newCategory,setNewCategory]=useState("")
  const [newLimit, setNewLimit] = useState("");
  const [newtargetAmount, setNewtargetAmount] = useState("");
  const [newDuration, setNewDuration] = useState("");


  const newLimitData = { category: newCategory, targetAmount: newtargetAmount, duration: newDuration };
  const deleteOneLimit = async (data)=>{
    console.log("trying to delete")
    await deleteLimit(data).then((res)=>{
      notifySuccess("Successfully Deleted")
      fetchLimits()
    }).catch(e=>notifyFailure())
  }
  const fetchLimits = async () => {
    await getLimit().then((res) => {
      console.log(res.data);
      setAllLimits(res.data)
    }).catch(e => console.log(e.message))
  }
  const createNewLimit = async (e) => {
    await setLimit(newLimitData).then(()=>notifySuccess("Successfully Added New Limit")).catch(e=>notifyFailure())
    fetchLimits()
  }
  
  useEffect(() => {
    fetchLimits()
  }, [])
  /* { goal: newGoal, targetAmount: newtargetAmount, currentAmount: newcurrentAmount, endDate: newendDate, completed: false } */

  return (
    <>
      <ToastContainer />
      <Container fluid>
        <Row>
          
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Add New Lmit</Card.Title>
                <p className="card-category">
                  This will help you to manage your finance limits.
                </p>
              </Card.Header>
              <Form>
                <Row>
                  <Col className="pl-4" md="6">
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            required
                        >
                            <option value="">Choose...</option>
                            <option value="Entertainment" >Entertainment</option>
                            <option value="Food">Food</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Transport">Transport</option>
                            <option value="Home utility">Home utility</option>
                            <option value="Miscellaneous" >Miscellaneous</option>
                        </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pl-1" md="5">
                    <Form.Group style={{marginLeft:"1rem"}}>
                    <Form.Label>Duration</Form.Label>
                    <Form.Control as="select"
                        value={newDuration}
                        onChange={(e) => setNewDuration(e.target.value)}
                        required
                    >
                        <option value="">Choose...</option>
                        <option value="Weekly" >Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                   
                    </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
              
                  <Col className="pl-1" md="5">
                    <Form.Group style={{marginLeft:"1rem"}}>
                      <label>Target Amount</label>
                      <Form.Control
                        placeholder="Limit amount"
                        type="number"
                        value={newtargetAmount}
                        onChange={(e)=>setNewtargetAmount(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-grid gap-2 pl-2">
                  <Button className="btn-fill pull-right" variant="success" onClick={createNewLimit}>
                    Add Goal
                  </Button>
                </div>
                <br></br>
              </Form>
            </Card>
          </Col>
         
          <Col md="12">
          <ol>
          {
            
            allLimits.map((el)=>{
                return (
                    <Limits {...el} deleteOneLimit={deleteOneLimit} />
                    // <li>
                    //     <ul>
                    //         <li> Category:{el.category}</li>
                    //         { el.limits.map((d)=>{
                    //             return (
                    //                 <>
                    //                 <li>Duration:{d.duration} Amount:{d.amount} </li>
                    //                 </>
                    //             )
                    //         })

                    //         }
                    //     </ul>
                    
                    // </li>
                )
            })
          }
            </ol>

          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Maps;
