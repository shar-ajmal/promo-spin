
import Wheel from './Wheel';
import { useState } from 'react';
import UserForm from './UserForm';
import NavbarUserForm from './NavbarUserForm';

export default function SpinPage({wheelElements, s}) {
    const [selectedItem, setSelectedItem] = useState(null)
    
    function selectItemIndex() {
        const selectedItemIndex = Math.floor(Math.random() * wheelElements.length);
        setSelectedItem(selectedItemIndex)
        console.log(selectedItemIndex)
    }

    return (
        <div>
            <NavbarUserForm></NavbarUserForm>
            <Wheel wheelElements={wheelElements} selectedItem={selectedItem}/>
            {/* <UserForm wheelElements={wheelElements} selectItemIndex={selectItemIndex}></UserForm>
            <button onClick={selectItemIndex}>test</button> */}
        </div>
    )
}