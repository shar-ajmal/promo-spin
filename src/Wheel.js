import React from 'react';

import './wheel.css';
import UserForm from './UserForm';

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    console.log("IN CONSTRUCTOR")
    console.log(this.props.selectedItem)
    this.state = {
      selectedItem: null,
    };
    this.selectItem = this.selectItem.bind(this);
  }

  selectItem() {
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.props.wheelElements.length);
      // if (this.props.onSelectItem) {
      //   this.props.onSelectItem(selectedItem);
      // }
      this.setState({ selectedItem });
      // console.log(selectedItem)
      // console.log(this.props.wheelElements[selectedItem])
      // console.log(this.props[selectedItem])
      console.log("RETURNING SELECTED ITEM")
      return selectedItem;
    } 
    else {
      console.log("in 2nd part of select item function")
      //resets state to null
      this.setState({ selectedItem: null });
      //runs select item function again
      setTimeout(this.selectItem, 500);
    }
  }

  render() {
    const { selectedItem } = this.state;
    const  items = this.props.wheelElements
    const formFields = this.props.gameData['form_fields']
    // console.log()
    // const items = ['dog', 'cat']
    console.log("selectedItemInWheel")
    console.log(selectedItem)
    // console.log(this.props.items.map((doc) => {return doc.name}))
    // console.log(items2)
    console.log(items)
    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
    };
    const spinning = selectedItem !== null ? 'spinning' : '';
    const smallFont = items.length > 10 ? 'small-font' : '';


    // console.log("in wheel.js")
    // console.log(userId)
    return (
      <div>
        <p className='disclaimer'>By filling this out, you agree to recieve promotional material. Don't worry, we won't spam you. :)</p>
        <div className="wheel-container">
          <div className={`wheel ${spinning}`} style={wheelVars}>
            {items.map((item, index) => (
            <div className={`wheel-item ${smallFont}`} key={index} style={{ '--item-nb': index }}>
            {item}
              </div>
            ))}
          </div>
        </div>
        <UserForm gameData={this.props.gameData} userId={this.props.userId} selectedItem={this.state.selectedItem} wheelElements={this.props.wheelElements} selectItem={this.selectItem}></UserForm>
      </div>
    );
  }
}
