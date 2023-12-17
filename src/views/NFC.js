import React from "react";
import {
    Badge,
    Button,
    Card,
    Navbar,
    Nav,
    Container,
    Row,
    Col,
  } from "react-bootstrap";

import Scan from '../containers/Scan';
// import Write from '../containers/Write';
import { useState } from 'react';
import { ActionsContext } from '../contexts/context';

function Icons() {

  const [actions, setActions] = useState(null);
  const {scan, write} = actions || {};

  const actionsValue = {actions,setActions};

  const onHandleAction = (actions) =>{
    setActions({...actions});
  }


  


  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header as="h3">Near Field Communication Tag Reading</Card.Header>
              <hr></hr>
            </Card>
            
          </Col>
          <Col>
           
            <h1>NFC Tool</h1>
            
            <button onClick={()=>onHandleAction({scan: 'scanning', write: null})} className="btn">Scan</button>
            {/* <button onClick={()=>onHandleAction({scan: null, write: 'writing'})} className="btn">Write</button> */}
  
            <ActionsContext.Provider value={actionsValue}>
            {scan && <Scan/>}
            {/* {write && <Write/>} */}
            </ActionsContext.Provider>
        </Col>
        </Row>
      </Container>
    </>
  );
}

export default Icons;





