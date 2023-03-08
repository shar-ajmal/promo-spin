import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, query, where} from 'firebase/firestore'
import { db } from "./firebase-config";
import { v4 as uuidv4 } from 'uuid';

import "./gamecustom.css";

export default function GameFields({user, gameData, gameId}) {
    const [formFields, setFormFields] = useState([])    

    useEffect(() => {
        setFormFields(gameData.form_fields)
    }, [])

    function findFormFieldsIndex(fieldId) {
        for (var i=0; i<formFields.length; i++) {
            if (formFields[i]['fieldId'] === fieldId) {
                return i
            }
        }
    }
    
    function handleChange(e, fieldId) {
        var formFieldIndex = findFormFieldsIndex(fieldId)
        console.log(formFieldIndex)
        var updatedFormFields = [...formFields]
        updatedFormFields[formFieldIndex]['fieldName'] = e.target.value
        setFormFields(updatedFormFields)
    }

    function deleteFormField(fieldId) {
        var formFieldIndex = findFormFieldsIndex(fieldId)
        var updatedFormFields = [...formFields]
        updatedFormFields.splice(formFieldIndex, 1)
        setFormFields(updatedFormFields)
    }

    function addNewField() {
        setFormFields(rows => [...rows, {'fieldName': '', 'deletable': true, 'fieldId': uuidv4()}])
    }

    const updateGame = async() => {
        const gamesCollectionRef = collection(db, 'games');
        const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
        getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
            const docRef = doc(db, "games", res.docs[0].id);
            console.log(docRef)
            updateDoc(docRef, { 'form_fields': formFields });
        })
        if (docRef.empty) {
            console.log('No matching documents.');
            return;
        }
    }

    function save() {
        updateGame()
    }

    return (
        <div>
                {console.log("printing field values")}
                {console.log(formFields)}
            <div className="form-fields">
                {formFields.map((element, index) => {
                    return (
                        <div>
                            {console.log("In render looking at elements")}
                            {console.log(element.fieldId)}
                            {element.deletable ?  
                            <>
                                <input value={element.fieldName} onChange={(e) => {handleChange(e, element.fieldId)}}/>
                                <button  onClick={() => deleteFormField(element['fieldId'])}>Delete</button>
                            </>
                            : 
                            <>
                                <input value={element.fieldName}/> 
                            </>
                            }
                        </div>
                    )
                })}
            </div>
            <div className="form-field-button-section">
                <button onClick={addNewField}>Add New Field</button>
                <button onClick={save}>Save</button>
            </div>
        </div>
        
        
    )
}