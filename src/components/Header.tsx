import React from 'react'
import { Link } from 'react-router-dom'
import useStore from '../useStore'
import SideMenu from './SideMenu'
import logo from '../assets/img/logo-easystarter.svg'
import menu_logo from '../assets/img/logofav.svg'
import menu from '../assets/img/menu.webp'
  
interface HeaderProps {
	type : string
}

const Header = ({ type } : HeaderProps) => {
	const { update, adminid} = useStore()
	const updateStatus = (params : {[key : string] : string | number | boolean | any}) => setStates({ ...state, ...params })
	const [state, setStates] = React.useState({
		showSideMenu : false
	})
	return (
		<>
			<header>
				<div className="container">
					<div className='justify' >
						<Link to="/"><img src={logo} className="logo " alt={'logo'} /></Link>
						<div className='justify middle'>
							<Link to="/admin" className={`header-menu ${type === "admin" ? 'active'  : ''}`}><span><img src={menu_logo} alt="logo" /></span>Admin</Link>
							{
								adminid===null || adminid ===''? (<>
									<Link to="/login" className={`header-menu ${type === "login" ? 'active'  : ''}`}><span><img src={menu_logo} alt="logo" /></span>Login</Link>
								</>)
								:(<>
									<span className={`header-menu`} onClick={() => {update({adminid:''}); window.location.href = '/login'; }}><span><img src={menu_logo} alt="logo" /></span>Logout</span>
								</>)
							}
							  <span className="side-menu" onClick={() => { updateStatus({ showSideMenu : true }) }}><img src={menu} alt={'menu'} /></span>
						</div>
					</div>
				</div>
			</header >
			
			<SideMenu menushow={state.showSideMenu} onClose={() => updateStatus({ showSideMenu : false })}  />
		</> 
	) 
};
 
export default Header;