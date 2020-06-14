import React, { Component } from 'react'
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'
 
//import images from local
import img1 from './img/1.png'
import img2 from './img/2.png'
 
const imageList = [img1, img2]
 
class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null
    }
    console.log(props.lol);
    this.onPick = this.onPick.bind(this)
  }
 
  onPick(image) {
    this.setState({image})
  }
 
  render() {
    return (
      <div>
        <ImagePicker 
          images={imageList.map((image, i) => ({src: image, value: i}))}
          onPick={this.onPick}
        />
        <button type="button" onClick={() => console.log(this.state.image)}>OK</button>
      </div>
    )
  }
}
 
export default Test