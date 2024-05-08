import React from 'react';

import './index.css';
import UserForm from './UserForm';

export default class SpinWheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
    };
    this.selectItem = this.selectItem.bind(this);
  }

  selectItem() {
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.props.items.length);
      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem);
      }
      this.setState({ selectedItem });
    } else {
      this.setState({ selectedItem: null });
      setTimeout(this.selectItem, 500);
    }
    return this.state.selectedItem
  }

  render() {
    const { selectedItem } = this.state;
    const items = this.props.wheelElements;

    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
      '--wheel-color': this.props.wheelColor,
      '--text-color': this.props.textColor,
    };
    const spinning = selectedItem !== null ? 'spinning' : '';
    const smallFont = items.length > 10 ? 'small-font' : '';

    return (
      <div className="wheel-container" style={wheelVars}>
        <div className={`wheel ${spinning}`} style={wheelVars}>
          {items.map((item, index) => (
            item.length > 10 ? 
            <div className={`wheel-item small-font`} key={index} style={{ '--item-nb': index }}>
              {item}
            </div>
            :
            <div className={`wheel-item ${smallFont}`} key={index} style={{ '--item-nb': index }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
