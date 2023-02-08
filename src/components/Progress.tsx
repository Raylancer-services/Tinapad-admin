
import {NF} from '../util'
import '../assets/scss/easystarter.scss'

const Progress = ({value, max}) => {
	return (
		<div className='ml3 mr3'>
			<div style={{borderRadius: '5px', height: '5px', backgroundColor:'rgba(0, 0,0,0.9)', position:'relative', width:'100%', overflow:'hidden', display:'block'}}>
				<span style={{position: 'absolute', left:0, top:0, backgroundColor:'#1a6bff', height:'5px', borderRadius:'5px', width:`${NF(value*100/max, 0)}%`}}></span>
			</div>
			<div className='justify'>
				<p style={{fontSize:'0.8rem'}}>{NF(value*100/max)+'%'}</p>
				<p style={{fontSize:'0.8rem'}}>{value}/{max}</p>
			</div>
		</div>
	)
}

 
export default Progress;