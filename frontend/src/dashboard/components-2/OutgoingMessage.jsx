import React, {Component} from 'react';
import './OutgoingMessage.css';

class OutgoingMessage extends Component {
  state = {
  }
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May","Jun","Jul", "Aug", "Sep", "Oct", "Nov","Dec"];
  
  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  render(){
    return(
      <div className="outgoing-message-cover">
        <div className="outgoing-message">
          <p>{this.props.content.msg}</p>
          {/* <span class="timestamp"> 11:01 AM    |    June 9</span> */}
          <div><span class="timestamp">{this.formatAMPM(this.props.content.date) + " | "+ 
          this.monthNames[this.props.content.date.getMonth()] + " " + 
          this.props.content.date.getDate()}</span></div>
          
        </div>
      </div>
    )
  }
}

export default OutgoingMessage;