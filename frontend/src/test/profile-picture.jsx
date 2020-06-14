import React from 'react'
import ReactDOM from 'react-dom'
import Avatar from 'react-avatar-edit';


class Test extends React.Component {

  constructor(props) {
    super(props)
    const src = 'https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg'
    this.state = {
      preview: null,
      src
    }
    this.onCrop = this.onCrop.bind(this)
    this.onClose = this.onClose.bind(this)
  }
  
  onClose() {
    this.setState({preview: "null"})
  }
  
  onCrop(preview) {
    this.setState({preview})
  }
  
  render () {
    return (
      
      <div>
        <Avatar
          width={390}
          height={295}
          onCrop={this.onCrop}
          onClose={this.onClose}
          src={this.state.src}
        />
        <img src={this.state.preview} alt="Preview" />
      </div>
    )
  }
}
export default Test;
