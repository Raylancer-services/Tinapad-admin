import React from 'react'
import useStore from '../useStore'
import {TF, tips, toBigNum, toBalance, proxy} from '../util';
import Header from '../components/Header'
import Footer from '../components/Footer'
import Progress from '../components/Progress'
import {  Binance, Ethereum, Close, Twitter, Telegram, Website, Discord } from '../components/Icons'
import Networks from '../config/network.json'
import '../assets/scss/account.scss'

const Admin = () => {
	const {call, update, adminid, adminname} = useStore()
	const updateStatus = (params: {[key: string]: string | number | boolean | Blob | any }) => setStates({ ...state, ...params })

	
	const poolState = {
		0	:	"pending",
		1	:	"accepted",
		5	:	"rejected",
		10	:	"allowed"
	}
	const poolClassType = {
		0	:	"saled",
		1	:	"upcoming",
		5	:	"active",
		10	:	"ended"
	}

	const [state, setStates] = React.useState({
		pools :	[],
		showPoolModal : false,
		pool : {
			chainId : 1,
			title : "",
			description : "",
			tokenAddress : '',
			price : 0,
			tier : 1,
			totalToken : 0,
			totalSold : 0,
			ownerAddress : '',
			ownerInfo : '',
			minPurchase : 0,
			maxPurchase : 0,
			startTime : 0,
			endTime : 0,
			closeTime : 0,
			token : {
				icon : "",
				image : "",
				symbol : ""
			},
			whitelist : {
				open : 0,
				end : 0,
				accounts : {}
			},
			vesting : {
				hasVesting : true,
				text : ""
			},
			socials : {
				twitter : "",
				telegram : "",
				discord : "",
				site : ""
			},
			kyc : {
				hasKyc : false,
				url : ""
			},
			swap : {
				currencyTokenAddress : "",
				totalRaise : 0,
				symbol : ""
			},
			dates : {
				registion : 0,
			},
			withdrawTime : 0,
			state : 0
		},
		rate : 0,
		type : '',
		input1 : 0, 
		input2 : 0,
		totalToken : 0,
		totalBalance : 0
	})

	
	const today = new Date().getTime();

	
	const getPools = async ()=>{
		try{
			update({loading : true})
			var items = await call('/admin/get-pools-list', {});
			items = items?.result;
			updateStatus({pools:items})	
			update({loading : false})
		}catch( e ){
			update({loading : false})
		}
	}
	const openModal = async (token) => {
			update({loading : true})
			var item = await call('/admin/get-pool-info', {tokenAddress: token});
			var rate = item?.result['price'];
			var totalToken = item?.result['totalToken'] - item?.result['totalSold'];
			const startTime = item?.result['startTime'];
			const endTime = item?.result['endTime'];
			const closeTime = item?.result['closeTime'];
			var today = new Date().getTime();
			var type = "upcoming";
			item = item?.result;
			if (startTime > today) {
				type= "upcoming";
			} else if (endTime <  today || closeTime >0) {
				type="ended";
			} else if (startTime <= today && endTime >= today && closeTime === 0) {
				type="active"
			} 
			updateStatus({pool : item, rate, totalToken, type, showPoolModal:true})
			update({loading : false})
	}
	const setPoolState = async (type) => {
		try{
			update({loading : true})
			var res = await call('/admin/set-pool-state', {tokenAddress: state.pool.tokenAddress, type: type, name:adminname, key:adminid});
			if(res?.error === 1){
				tips("Error: You have not permission")
			}else if(res?.error === 0){
				tips("Success: changed pool state")
			}else {
				tips("Error: Unknown error")
			}
			update({loading : false})
			let pool = state.pool;
			pool.state = type;
			updateStatus({pool})
		}catch( e ){
			update({loading : false})
		}
	}

	React.useEffect(() => {
		getPools();
	}, [])

	return (
		<div className="pools">
			<Header type="admin" />
			<div className="container" style={{minHeight:'70vh'}}>
				<div className="card">
				{
					adminid===null || adminid ===''? (<>
						<h3 className='text-center'>Cannot access this page</h3>						
					</>)
					:(
						<>
							{state.pools && state.pools.length > 0 && <div className='row header-row  ml3 mr3' style={{padding:'1em'}}>
								<div className="col-lg-1">Logo</div>
								<div className="col-lg-2 col-sm-6">
									Pool Name
								</div>
								<div className="col-lg-1 col-sm-6">
									Chain
								</div>
								<div className="col-lg-2 col-sm-6">
									Price
								</div>
								<div className="col-lg-2 col-sm-6"> 	
									Total Raise
								</div>
								<div className="col-lg-2 col-sm-6">
									Total Sold
								</div>
								<div className="col-lg-2 col-sm-6">
									State
								</div>
							</div>}
							{
								state.pools.length > 0 &&
								state.pools.map((item, i) => (
									(
										<div onClick={()=>{openModal(item['tokenAddress'])}} key={i} className="history-row p3 row middle">
											<div className="col-lg-1 col-sm-6">
												<img src={(`${proxy + "/logo/"+ item['token']['icon']}`)} alt="pool-icon" className='pool-icon' />
											</div>
											<div className="col-lg-2 col-sm-6">
													<h5 >{item['title']}</h5>
											</div>
											<div className="col-lg-1 col-sm-6">
													{item['chainId'] <= 6 ?<Ethereum width={35} height={35} />:<Binance width={35} height={35} />}
											</div>
											<div className="col-lg-2 col-sm-6">
												<p className='token-black'>{`1${item['token']['symbol']}`} =  {item['price']+item['swap']['symbol']}</p>
											</div>
											<div className="col-lg-2 col-sm-6">
												<p>{`${item['swap']['totalRaise']+" "+item['swap']['symbol']}`}</p>
											</div>
											<div className="col-lg-2 col-sm-6">
												<p>{`${item['totalSold']+" "+item['token']['symbol']}`}</p>
											</div>
											
											<div className="col-lg-1 col-sm-6">
												
												{
													item['totalToken']<=item['totalSold'] || item['closeTime']>0 ? (
														<b className={`token-black  type saled `  } style={{position:'relative', top:0, padding:'10px'}}>{`ended`}</b>
													):(
														<b className={`token-black  type ${poolClassType[item['state']]}` } style={{position:'relative', top:0}}>{`${poolState[item['state']]}`}</b>
													)
												}
											</div> 
											<div className="col-lg-1 col-sm-6 row center">
												{
													(item['totalToken']==item['totalSold'] || item['closeTime']> 0) && item['withdrawTime'] > 0 ? (
														<b className={`token-black  type saled `  } style={{position:'relative', top:0, margin:0, padding:'10px'}}>{`withdrawed`}</b>
													):(
														<></>
													)
												}
											</div> 
										</div>
									)
								))
							}
						</>
					)
				}
				</div>
			</div>
			<Footer/>
			
			<div className={`modal ${!state.showPoolModal?'hide':''}`}>
				<div className="modal-container" >
					<div className="row center middle" >
						<img src={(`${proxy + "/logo/" + state.pool['token']['icon']}`)} alt="pool-icon" style={{width : '50px', marginRight : '1em'}} />
						<h3 className='m0 mb2 text-center'>{state.pool['title']} </h3> 
						<span className='close-btn' onClick={() => { updateStatus({ showPoolModal : false }) }}><Close width={20} height={20} /></span>
						<b className={`btn-join ${state.pool['state'] ===0 ? 'active':''}`} onClick={()=>{setPoolState(0)}} style={{position:'relative', marginLeft:'1em', top:0}}>Pending</b>
						<b className={`btn-join ${state.pool['state'] ===5 ? 'active':''}` } onClick={()=>{setPoolState(5)}} style={{position:'relative', marginLeft:'1em', top:0}}>Reject</b>
						<b className={`btn-join ${state.pool['state'] ===10 ? 'active':''}` } onClick={()=>{setPoolState(10)}} style={{position:'relative', marginLeft:'1em', top:0}}>Allow</b>
					</div>
					
					<div className="row center">
							<div className="col-lg-4 col-md-12">
								<div className="pool-details-card">
									<div className="justify middle">
										<h3>{state.pool['title']}</h3>
										{state.pool['chainId'] <=6 ? <Ethereum width={30} height={30} /> : <Binance width={30} height={30} />}
									</div>
									<img src={(`${proxy + "/img/"+ state.pool['token']['image']}`)} alt="img" className="pool-img"/>
									<p className='text-dark'><b>{`1${state.pool['token']['symbol'] } = ${state.pool['price']+state.pool['swap']['symbol']}`}</b></p>
									<p className='text-dark'><b>{`1${state.pool['swap']['symbol']} = ${(1/state.pool['price'])} ${state.pool['token']['symbol']}`}</b></p>
									
									<div className="row mt3">
										<div className="col-12 m0 p0">
											<Progress value={state.pool['totalSold']} max={state.pool['totalToken']}/> 
										</div>
									</div>
									<div className="row mt3">
										<div className="col-12">
											<b>Chain : </b>
											<b className='token-black pl3'>{`${Networks.networks[state.pool['chainId'] + ""]}`}</b>
										</div>
									</div> 
								</div>
							</div>
							<div className="col-lg-8 col-md-12">
								<div className="pool-details-card pl3 pr3">
									<span className={`type ${state.type}`}>{`${state.type}`}</span>
									<p className='text-dark h5'>
										{state.pool['description']}
									</p>
									<div className="row pl3">
										<a className='social-link ml3' style={{ color : 'var(--default-color-2)' }} target="_blank" rel='noreferrer' href={state.pool['socials']['twitter']}><Twitter width={25} height={25} /></a>
										<a className='social-link ml3' style={{ color : 'var(--default-color-2)' }} target="_blank" rel='noreferrer' href={state.pool['socials']['discord']}><Discord width={25} height={25} /></a>
										<a className='social-link ml3' style={{ color : 'var(--default-color-2)' }} target="_blank" rel='noreferrer' href={state.pool['socials']['telegram']}><Telegram width={25} height={25} /></a>
										<a className='social-link ml3' style={{ color : 'var(--default-color-2)' }} target="_blank" rel='noreferrer' href={state.pool['socials']['site']}><Website width={25} height={25} /></a>
									</div>
									<h5>POOL INFORMATION</h5>
									<div className="row m0 bb1 ">
										<div className="col-lg-3"><p>Token Address : </p></div>
										<div className="col-lg-9"><p style = {{overflow:'hidden'}}>{`${state.pool['tokenAddress']}`}</p></div>
									</div>
									<div className="row m0 bb1 ">
										<div className="col-lg-3"><p>Swap Token Address : </p></div>
										<div className="col-lg-9"><p style = {{overflow:'hidden'}}>{`${state.pool['swap']['currencyTokenAddress']  === '0x0000000000000000000000000000000000000000' ?Networks.networks[String(state.pool.chainId)] +" Native Token":state.pool['swap']['currencyTokenAddress']}`}</p></div>
									</div>
									<div className="row m0 bb1">
										<div className="col-lg-3"><p>Total raise : </p></div>
										<div className="col-lg-9"><p>{`${state.pool['swap']['totalRaise'] + " " + state.pool['swap']['symbol']}`}</p></div>
									</div>
									
									<div className="row m0 bb1">
										<div className="col-lg-3"><p>Total token : </p></div>
										<div className="col-lg-9"><p>{`${state.pool['totalToken'] +  " " + state.pool['token']['symbol']}`}</p></div>
									</div>
									<div className="row m0 bb1">
										<div className="col-lg-3"><p>Total Sold : </p></div>
										<div className="col-lg-9"><p>{`${state.pool['totalSold'] + " " + state.pool['token']['symbol']}`}</p></div>
									</div>
									<div className="row m0 bb1 ">
										<div className="col-lg-3"><p>Min Purchase : </p></div>
										<div className="col-lg-9"><p>{`${state.pool['minPurchase']}`}</p></div>
									</div>
									<div className="row m0 bb1 ">
										<div className="col-lg-3"><p>Max Purchase : </p></div>
										<div className="col-lg-9"><p>{`${state.pool['maxPurchase']}`}</p></div>
									</div>
									<div className="row m0 bb1 ">
										<div className="col-lg-3"><p>Start/End :</p></div>
										<div className="col-lg-9"><p>{`${TF(state.pool['startTime'])} - ${TF(state.pool['endTime'])}`}</p></div>
									</div>
									
									<div className="row m0 bb1 ">
										<div className="col-lg-3"><p>Whitelist Start/End :</p></div>
										<div className="col-lg-9"><p>{`${TF(state.pool['whitelist']['open'])} - ${TF(state.pool['whitelist']['end'])}`}</p></div>
									</div>
									<div className="row m0 bb1">
										<div className="col-lg-3"><p>Registration : </p></div>
										<div className="col-lg-9"><p>{TF(state.pool['dates']['registion'])}</p></div>
									</div>
									<div className="row m0 bb1">
										<div className="col-lg-3"><p>Close Time : </p></div>
										<div className="col-lg-9"><p>{TF(state.pool['closeTime'])}</p></div>
									</div>
									<div className="row m0 bb1">
										<div className="col-lg-3"><p>Withdrawed Time : </p></div>
										<div className="col-lg-9"><p>{TF(state.pool['withdrawTime'])}</p></div>
									</div>
									<div className="row m0 bb1">
										<div className="col-lg-3"><p>Vesting : </p></div>
										<div className="col-lg-9"><p >{state.pool['vesting']['text']}</p></div>
									</div>
									<h5 className='mt5'>USER INFORMATION</h5>
									<div className="row m0 bb1">
										<div className="col-lg-3"><p>Tier : </p></div>
										<div className="col-lg-9"><p>{state.pool['tier']}</p></div>
									</div>
									<div className="row m0 bb1">
										<div className="col-lg-3"><p>Is whitelisted : </p></div>
										<div className="col-lg-9"><p>{state.pool['whitelist'].open >today && state.pool.whitelist.end < today ? 'Active':'Disable'}</p></div>
									</div>
									<div className="row m0 bb1">
										<div className="col-lg-3"><p>Has KYC : </p></div>
										<div className="col-lg-9"><p>{state.pool['kyc']['hasKyc']}</p></div>
									</div>
								</div>
							</div>
						</div>
				</div>
			</div>
		</div>
	)
}

export default Admin
