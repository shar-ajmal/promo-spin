import { useEffect, useState } from 'react';
import { Input, Button, Space, Typography } from 'antd';

export default function InputFields({fuckhello,tableValues, setTableValues, id, fName, fProbability}) {
    var [fieldName, setFieldName] = useState('')
    var [fieldProbability, setFieldProbability] = useState('')

    useEffect (() => {
        var tableIndex = findTableValueIndex()
        console.log("Here mate")
        console.log(tableIndex)
        console.log(fName)
        setFieldName(fName)
        setFieldProbability(fProbability)
    })
    console.log("Inside INPUT FIELDS")
    console.log(fuckhello)
    console.log(fName)
    console.log(fProbability)
    console.log(tableValues['tableValues'])

    function findTableValueIndex() {
        console.log("Checking out table values")
        console.log(tableValues)
        for (var i=0; i<tableValues.length; i++) {
            if (tableValues[i]['id'] === id) {
                return i
            }
        }
    }

    function changeName(e) {
        setFieldName(e.target.value)
        var tableIndex = findTableValueIndex()
        var newTableValues = [...tableValues]
        newTableValues[tableIndex]['name'] = e.target.value
        console.log("New table values are")
        console.log(tableValues)
        setTableValues(newTableValues)
    }

    function changeProbability(e) {
        setFieldProbability(e.target.value)
        var tableIndex = findTableValueIndex()
        var newTableValues = [...tableValues]
        newTableValues[tableIndex]['probability'] = e.target.value
        setTableValues(newTableValues)
    }

    function deleteEntry() {
        console.log("deleting entry")
        console.log(id)
        console.log("Before Deletion Array")
        console.log(tableValues)
        setTableValues((current) => {
            console.log(current)
            return current.filter((row) => 
                // console.log(row.id);
                row.id != id
            )
        })

        console.log("After Deletion Array")
        console.log(tableValues)
    }
    
    return (
        <>
            <td><Input value={fieldName} onChange={changeName}/></td>
            <td className='prob-row'><Input value={fieldProbability} onChange={changeProbability} type="number" pattern="^-?[0-9]\d*\.?\d*$"/> <div className='prob-percent'>%</div> </td>
            <td><Button danger class="button-red" onClick={deleteEntry}>Delete</Button></td>
        </>
    )
}