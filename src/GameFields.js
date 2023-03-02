import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

import "./gamecustom.css";

export default function GameFields({user, gameId, formFields, setFormFields}) {

    useEffect(() => {}, [])

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
                <button>Save</button>
            </div>
        </div>
        
        
    )
}