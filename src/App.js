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
    const [user, setUser] = useState();

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

    console.log('Checking out user')
    console.log(user)
    
      return (
        <Router>
          <html translate="no">
          <div className="App">
            <Routes>
              <Route element={<ProtectedRoute user={user}/>}>
                <Route path="/" element={<GamePage user={user}></GamePage>}/>
                <Route path="/emails" element={<EmailPage user={user}></EmailPage>}/>
                <Route path="/chart" element={<ChartPage user={user}></ChartPage>}/>
                <Route path="/info" element={<Settings user={user}></Settings>}/>
                <Route path="/game/:gameId" element={<GameCustom user={user}/>}/>
              </Route>
              <Route element={<PublicRoute user={user}/>}>
                <Route path="/login" element={<SignInPage user={user}></SignInPage>}/>
              </Route>
              <Route path="/spin/:gameId" element={<SpinPage user={user}/>}/>
            </Routes>
          </div>
          </html>
        </Router>
      );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
