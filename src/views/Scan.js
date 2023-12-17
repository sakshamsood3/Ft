import React,{useEffect, useState} from 'react';
import Tesseract from 'tesseract.js';
import Modal from "components/modelScan";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {
    Badge,
    Button,
    Card,
    Form,
    Navbar,
    Nav,
    Table,
    Container,
    Row,
    Col,
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";
import { Spinner } from 'react-bootstrap';

import { Oval } from  'react-loader-spinner'

export default function Scan() {
    const [modalShow, setModalShow] = useState(false);
    const [imagePath, setImagePath] = useState("");
    const [image, setImage] = useState("");
    const [text, setText] = useState("");
    const [confidence,setConfidence]=useState("");
    const [loading,setLoading]=useState(false);
    const [five,setFive]=useState([]);
    const [modalNumber,setmodalNumber]=useState(0);
    const [apiResp,setApiResp]=useState({})
    const [finalInfo,setfinalInfo]=useState({})
    const [showResults,setShowResults]=useState(false)
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

    const handleChange = (event) => {
        setModalShow(false);
        setImagePath("");
        setImage("");
        setText("");
        setConfidence("");
        setLoading(false);
        setFive([]);
        setmodalNumber(0);
        // setApiResp({})
        setShowResults(false)
        setImagePath(URL.createObjectURL(event.target.files[0]));
        setImage(event.target.files[0]);
  
     
       
    }
    const closeModel = ()=>{
      setModalShow(false)
    }
    useEffect(()=>{
      resultProcess()
    },[apiResp])
   
    const resultProcess=()=>{
      if(Object.keys(apiResp).length!=0){
      const options = {
        method: "POST",
        url: "https://api.edenai.run/v2/ocr/invoice_parser",
        headers: {
          Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjNmNWYyMDMtYmM0NS00YzkxLTk5OWItOWZiYjNjNzM5NDBmIiwidHlwZSI6ImFwaV90b2tlbiJ9.fBv6X3Hac7QWfAtZSCL-TNeZKtLPUA31RxWspOMvbig",
        },
        data: {
          providers: "amazon",
          language: "en",
          file_url: apiResp.imUrl,
          fallback_providers: "",
        },
      };
      axios
        .request(options)
        .then((response) => {
          let priceList=apiResp.priceList
          setFive(
            five.concat([...(priceList.sort((a, b)=>a - b).slice(priceList.length-3)),response.data.amazon.extracted_data[0].invoice_total])
          )
          setfinalInfo({...apiResp,org:response.data.amazon.extracted_data[0].merchant_information.merchant_name||apiResp.org,date:response.data.amazon.extracted_data[0].date,apiExtern:response.data})
          if(apiResp.extractedText){
            setLoading(false)
            const text = apiResp.extractedText
            notifySuccess("Job completed")
            setText(text);
            setShowResults(true)
          }else{
              Tesseract.recognize(
                imagePath,'eng',
                { 
                  logger: m => console.log(m) 
                }
              )
              .catch (err => {
                console.error(err);
                setLoading(false)
                notifyFailure()
              })
              .then(result => {
                setLoading(false)
                console.log(result)
                const confidence = result.data.confidence;
                const text = apiResp.extractedData||result.data.text;
                notifySuccess("Job completed")
                setText(text);
                // setFive(five.length<=0?five.concat(analyzeResult(result.data)):five.concat([]))
                // analyzeResult(result.data)
                setConfidence(confidence);
                setShowResults(true)
              })
          }
        })
      }
   
    }
    const handleClick = async () => {
        setLoading(true)
        setShowResults(false)
        notifySuccess("Job started , it may take few minutes")
        
        let formData=new FormData()
        formData.append('file',image)
         axios.post("http://localhost:3005/testing",formData)
         .then((res)=>{
        try{
          if(res.data.msg==="oops"){
            console.log("Can't Process this bill")
            setApiResp({
              category:"Miscellaneous",
              price:0,
              priceList:[],
              org:"",
              date:"",
              imUrl:res.data.imUrl,
            })
          }else{
            
          setApiResp({...res.data,priceList:JSON.parse(res.data.priceList)})
          }
          console.log("DONE HERE")
          // resultProcess()
    
        }
        catch(e){
          console.error(e);
            setLoading(false)
            notifyFailure()
        }

 
      })
    }

    const analyzeResult = (data)=>{

      const wordsArray = data.words.map(word=>parseInt(word.text))
      // Regular expression to match prices in different currencies
      const priceRegex = /(?:(?<=€)|(?<=\$)|(?<=Rs\.)|(?<=\btotal\b)|(?<=\btotal amt : \b)|(?<=\bamount\b)|(?<=\bamt\b))\s*(\d+(?:\.\d{1,2})?)/gi;

      // Extract prices using the regular expression
      const prices = [];
      const fprices = [];
      let match;

      while ((match = priceRegex.exec(data.text.toLowerCase())) !== null) {  
        prices.push(parseFloat(match[1]));
      }
      console.log(prices)
      for(let i=0;i<prices.length;i++){
        let p=prices[i]
        if(p in five){
          continue
        }else{
          fprices.push(p)
        }
      }

     return fprices
      // return topFiveNums.reverse();
    }
    

    return (
        <>
        <ToastContainer />
        <Card classname="text-center" border="dark" style={{ width: 'auto' }}>
        <Card.Header as="h3">Scan Your Receipts</Card.Header>
        <hr></hr>
        <Row>
          <Col md="6">
            <Card.Body>
              <Form.Group controlId="formFileLg" className="mb-3">
                <Form.Label>Click to upload</Form.Label>
                <Form.Control type="file" size="lg" onChange={handleChange} />
              </Form.Group>
            </Card.Body>
          </Col>
          {
            showResults && (
          <Col md="6" style={{display:"flex",flexDirection:"column"}}>
          <h4 style={{margin:"0"}}>Predicted Category:</h4>
          <br></br>
          <Button className="btn-fill pull-right" variant="info" style={{width:"75%",marginRight:"auto",marginLeft:"auto"}}>
          <h4 style={{margin:"0"}}>{finalInfo.category}</h4>
          </Button>
          
          </Col>)
          }
          {
            loading && (
              <Col md="6"  style={{display:"flex",justifyContent:"center"}}>
              <Oval
              height={80}
              width={80}
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
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
        </Row>
        <Row>
          <Col md="6">
            
            <Card.Body>
            <Button className="btn-fill pull-right" variant="success" type="submit" onClick={handleClick}>Convert To Text</Button>
            <div>
              <br></br>
              <img src={imagePath} className="my-2" style={{width:400}} />
            </div>
            </Card.Body>
          </Col>
          {
            showResults && (<Col classname="pl-5" md="6" >   
            <h4>Select Bill Amount:</h4>
            <div style={{display:"flex",margin:"10%",flexWrap:"wrap",height:"10%",alignContent:"space-evenly"}}>
        
            {[...new Set(five)].map((one,index)=>{
              return (
                <>
              
                <Col style={{marginLeft: '1rem',margin:"10px"}}>
                <Button className="btn-fill pull-right" variant="info"
                onClick={() =>{
                  setmodalNumber(one)
                  setModalShow(true)
                }}>
                {one}
                </Button>
              </Col>
              {modalShow &&<Modal closeModel={closeModel} amount={modalNumber} apiResp={finalInfo} show={modalShow} onHide={() => setModalShow(false)}/>}
              </>
              )
            
            
            })}
            <>
              <Col style={{marginLeft: '1rem',margin:"10px"}}>
              <Button className="btn-fill pull-right" variant="info"
              onClick={() =>{
                setmodalNumber(0)
                setModalShow(true)
              }}>
              Other
              </Button>
            </Col>
            {modalShow &&<Modal closeModel={closeModel} amount={modalNumber} apiResp={finalInfo} show={modalShow} onHide={() => setModalShow(false)}/>}
            </>
            </div>
                {loading ? <Spinner /> : <div>
                  { confidence && <h5>Conversion accuracy = {confidence}%</h5>}
                  <p>{text}</p>
                  <h3>Item List</h3>
                  <ul>
                  {
                    finalInfo.apiExtern.amazon.extracted_data[0].item_lines.map((el)=>{
                      return (
                        <li>{el.description}: {el.amount}</li>
                      )
                    })
                  }
                 </ul>
                  
                </div>}
              
            </Col>)
          }
        </Row>
        </Card>
        </>
    )
}
