import logo from './logo.svg';
import './App.css';

import EmployeeInformation from './components/form';
import DisplayEmployees from './components/DisplayEmployees';



import {useState} from 'react'
function App(){

  const [Information, setInformation]=useState([]);
  return(
    <div className="App">
      <EmployeeInformation/>
      
    </div>
  )

}

export default App; 

