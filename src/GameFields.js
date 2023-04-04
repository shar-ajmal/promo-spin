import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, query, where} from 'firebase/firestore'
import { db } from "./firebase-config";
import { v4 as uuidv4 } from 'uuid';
import { Input, Button, Space } from 'antd';

import "./gamecustom.css";

export default function GameFields({user, formFields, setFormFields}) {
    // const [formFields, setFormFields] = useState([])    

    // useEffect(() => {
    //     setFormFields(gameData.form_fields)
    // }, [])

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

    return (
        <div>
                {console.log("printing field values")}
                {console.log(formFields)}
            <div className="form-fields">
                {formFields.map((element, index) => {
                    return (
                        <div className="input-container">
                            {console.log("In render looking at elements")}
                            {console.log(element.fieldId)}
                            {element.deletable ?  
                            <>
                                <Space.Compact style={{ width: '100%' }}>
                                <Input value={element.fieldName} onChange={(e) => {handleChange(e, element.fieldId)}}></Input>
                                {/* <input value={element.fieldName} onChange={(e) => {handleChange(e, element.fieldId)}}/> */}
                                <Button danger onClick={() => deleteFormField(element['fieldId'])}>Delete</Button>
                                </Space.Compact>
                            </>
                            : 
                            <>
                                <Input readOnly={true} value={element.fieldName}></Input>
                            </>
                            }
                        </div>
                    )
                })}
            </div>
            <div className="form-field-button-section">
                <Button type='primary' onClick={addNewField}>Add New Field</Button>
                {/* <button onClick={save}>Save</button> */}
            </div>
        </div>
        
        
    )
}