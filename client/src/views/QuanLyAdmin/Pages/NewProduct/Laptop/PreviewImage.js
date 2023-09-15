import {useState} from 'react'
import './style.css';

function PreviewImage({file}) {
    // console.log(file);
    const [preView, setPreView] = useState({});
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPreView(reader.result);
        }
    }
  return (
    <div className='preview_image'>
        <img style={{width:'100px'}} src={preView} alt=''/>
    </div>
  )
}

export default PreviewImage