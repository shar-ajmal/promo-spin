import React from 'react';

import {db} from './firebase-config'

import { v4 as uuidv4 } from 'uuid';


import './styles.css';
import './table.css'
import { async } from '@firebase/util';
import { collection, getDocs, doc, deleteDoc, addDoc, query, where} from 'firebase/firestore'
import { getAllByRole } from '@testing-library/react';
import { useState, useEffect } from 'react';
import InputFields from './InputField';
import { constructWheelArray } from './function';

export default function OptionTable({ user, wheelElements, setWheelElements, tableValues, setTableValues, tableCollectionRef}) {
    console.log("gae")
    console.log(tableValues)
    console.log(wheelElements)

    function validEntries() {
        var probSum = 0
        for (var i=0;i<tableValues.length;i++) {
            if (tableValues[i]['name'] == "" || tableValues[i]['probability'] == "") {
                alert("No fields can be empty!")
                return false
            }
            console.log(tableValues[i])
            console.log(tableValues[i]['probability'])
            probSum += parseInt(tableValues[i]['probability'])
        }

        console.log("probsum")
        console.log(probSum)
        if (probSum != 100) {
            alert("Probabilities need to equal 100!")
            return false
        }

        return true
    }

    function updateTableDatabase() {
        if (!validEntries()) {
            return
        }
        console.log("In updateTableDatabase")
        deleteTableData().then((res) => {
            tableValues.forEach((value) => {
                addValue(value)
            })
        })
        var wheelArray = constructWheelArray(tableValues)
        setWheelElements(wheelArray)
    }

    var deleteInputDatabase = async(id) => {
        var data = doc(db, 'table_values', id)
        await deleteDoc(data)
    }

    var addValue = async(data) => {
        console.log("in add value")
        var {id} = await addDoc(tableCollectionRef, {'name':data['name'], 'probability': data['probability'], 'user_id': user.uid})
        console.log("printing id")
        console.log(id)
    }

    var deleteTableData = async() => {
        let data = await getDocs(query(tableCollectionRef, where("user_id", "==", user.uid)))
        var docs = data.docs.map((doc) => ({...doc.data(), id:doc.id}))
        console.log("will print out each doc")
        docs.forEach((doc) => {
            deleteInputDatabase(doc.id)
            console.log(doc)
        })
        console.log(data.docs)
        console.log(docs)
    }

    function addEntry() {
        setTableValues(rows => [...rows, {'name':'', 'probability':'', 'id': uuidv4()}])
    }

    return (
        <div>
            <h1>Entry Table</h1>
            {console.log("HELLO")}
            {console.log(tableValues)}
            <table class="table" id="table">
                {console.log("gae3")}
                <tr>
                    <th>Entry Name</th>
                    <th>Probability</th>
                </tr>
                {tableValues.map((element, index) => { return (
                    <tr class="entry-row" id={"entry-row-" + index}>
                        <InputFields fuckhello={'fuckhello'} tableValues={tableValues} setTableValues={setTableValues} id={element.id} fName={element['name']} fProbability={element.probability}></InputFields>
                    </tr>
                )})}
                {console.log("gae5")}
                {console.log(tableValues)}
            </table>
            <button class="button-green" id="save-button"  onClick={updateTableDatabase}>Save</button>
            <button class="button-blue" id="add-button"  onClick={addEntry}>Add New Entry</button>
            {console.log("gae6")}
        </div>
    )
}