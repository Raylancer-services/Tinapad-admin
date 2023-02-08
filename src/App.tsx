import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import useStore from './useStore'
import Login from './pages/Login'
import CreateAdmin from './pages/CreateAdmin'
import Admin from './pages/Admin'
import Loading from './components/Loading'
import './assets/scss/easystarter.scss'

function App() {
	const {	loading, adminid } = useStore()
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={adminid==null || adminid =='' ? Login : Admin}></Route>
				<Route exact path="/login" component={Login}></Route>
				<Route exact path="/create-admin" component={CreateAdmin}></Route>
				<Route exact path="/admin" component={Admin}></Route>
				<Route path="*" component={Login}></Route>
			</Switch>
			<ToastContainer/>
			<Loading width={70} height={70} color={'var(--default-color-1)'} opacity={0.3} show={!!loading}/>
		</BrowserRouter>
	)
}

export default App
