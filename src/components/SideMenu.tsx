import { Link } from 'react-router-dom'
import {  toBalance } from '../util';
import { Close } from './Icons'
import Networks from '../config/network.json'
import logo from '../assets/img/logo-easystarter.svg'


interface SideMenuProps {
	menushow: boolean
	onClose: () => void
}

const SideMenu = ({ menushow,  onClose }: SideMenuProps) => {
	return (
		<>
			<div className={`side-menu-panel ${menushow ? 'show' : 'hide'}`}>
				<div className="header-bar justify">
					<img src={logo} alt="logo" />
					<span onClick={onClose}>
						<Close width={20} height={20} />
					</span>
				</div>
				<Link to="../admin" className='side-menu'>Admin</Link>
				<Link to="../login" className='side-menu'>Login</Link>
			</div>
		</>
	)
};

export default SideMenu;