import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Wheel from './Wheel';
import OptionTable from './OptionTable'
import SpinPage from './SpinPage';
import {db} from './firebase-config'
import { useNavigate } from "react-router-dom";


import './styles.css';
import { async } from '@firebase/util';
import { collection, getDocs, query, where } from 'firebase/firestore'
import { getAllByRole } from '@testing-library/react';
import { auth } from './firebase-config';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './AdminPage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import { constructWheelArray } from './function'
import EmailPage from './EmailPage';
import ChartPage from './ChartPage';
import SignInPage from './SignIn'; 
import Settings from './Settings';
import GameCustom from './GameCustom';

import './styles.css'
import GamePage from './GamePage';

export default function App () {
    // const [wheelElements, setWheelElements] = useState([]);
    // const [tableValues, setTableValues] = useState([]);
    const [user, setUser] = useState();
    
    // const wheelCollectionRef = collection(db, 'wheel_elements')
    // const tableCollectionRef = collection(db, 'table_values')
    // const navigate = useNavigate();


    // useEffect(() => {
    //   console.log("GALLL")
    //   getTableData()
    // }, []);

    // Keep track of the user if they are logged in
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(userAuth => {
      if (userAuth) {
        const user = {
          uid: userAuth.uid,
          email: userAuth.email
        }
        console.log('userAuth', userAuth)
        setUser(user)
      } else {
        setUser(null)
      }
      })
      return unsubscribe
    }, [])

    // const getTableData = async() => {
    //   let data = await getDocs(query(tableCollectionRef, where("user_id", "==", user.uid)));
    //   console.log("Table elements")
    //   console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
    //   setTableValues(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
    //   var wheelArray = constructWheelArray(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
    //   setWheelElements(wheelArray)
    //   console.log("table values")
    //   console.log(tableValues)
    // }

    console.log('Checking out user')
    console.log(user)
    
      return (
        <Router>
          <html translate="no">
          <div className="App">
            <Routes>
              <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/" element={<GamePage user={user}></GamePage>}/>
                {/* <Route path="/" element={<AdminPage user={user}/>}/> */}
                <Route path="/emails" element={<EmailPage user={user}></EmailPage>}/>
                <Route path="/chart" element={<ChartPage user={user}></ChartPage>}/>
                <Route path="/info" element={<Settings user={user}></Settings>}/>
                <Route path="/custom" element={<GameCustom user={user}></GameCustom>}/>
                <Route path="/game/:gameId" element={<GameCustom user={user}/>}/>
              </Route>
              <Route element={<PublicRoute user={user}/>}>
                <Route path="/login" element={<SignInPage user={user}></SignInPage>}/>
              </Route>
              <Route path="/spin/:userId" element={<SpinPage user={user}/>}/>
            </Routes>
          </div>
          </html>
        </Router>
      );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
