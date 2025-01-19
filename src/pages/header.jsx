import React, { useState, useEffect } from "react";
import { useNavigate, useLocation} from 'react-router-dom';
import Select from 'react-select';
import SocialImg from "../Assets/images/social.jpg";
import BackImg from "../Assets/images/background.jpg";
import SideBarImg from "../Assets/images/sidebar.jpg";
import UpBarImg from "../Assets/images/upbar.jpeg";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "../Assets/Style/header.css";

import { RetrieveCards } from "./upload.jsx";

import Card from 'react-bootstrap/Card';

import user_photo from "../Assets/images/profile.png";


function Header(){
	const [cards, setCards] =useState([]);
	const [islogin,setIslogin] =useState(false);
	const [loading, setLoading] =useState(true);
	const [searchInput, setSearchInput] =useState("");
	const [searchOutput, setSearchOutput] =useState("");
	// const [searchType, setSearchType] = useState([]);
	

	useEffect(() => {
		fetchCards();
	}, []);

	const fetchCards = async ()=>{
		try{
			const responseCard= await fetch("http://localhost:3000/",{
				method:"GET",
				credentials: 'include',
			});
			if (responseCard.ok) {
				const dataDB = await responseCard.json();
				setCards(dataDB.data);
				setIslogin(dataDB.isLogin);
			} else {
				alert('Failed to retrieve cards');
			}
		}catch(error){
			console.error('Error retrieving cards:', error);
		}finally{
			setLoading(false)
		}
	};

	const handleLogOut = async() =>{
		const confirmLogout = window.confirm("Are you sure you want to log out?");
		
		if (confirmLogout) {
			try{
				const responseLog= await fetch("http://localhost:3000/logout",{
				method: "GET",
				credentials: 'include',
				})
				if(responseLog.ok){
					setIslogin(false)
					navigate("/login");
				}else{
					alert("Failed to Logout.")
				}

			}catch(error){
				console.error("Error logging out:", error);
			}
		}
	}

	const HandleSearch = async () => {
    try {
        const response = await fetch("http://localhost:3000/search", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ searchInput })
        });
        const user_output = await response.json();
        if (response.ok) {
            setSearchOutput(user_output);
        } else {
            setSearchOutput();
        }
        navigate("/search");
    } catch (error) {
        console.log(error);
    }
};

	const HandleKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault(); // Prevent the form from submitting
			HandleSearch(); // Trigger search
		}
	};

	const HandleUser_Display = async(id) =>{
		try{
			const response=await fetch(`http://localhost:3000/search?user_id=${id}`,{
				method:"GET",
				credentials:"include",
			})
			const detail=await response.json();
			if(response.ok){
				console.log(detail.data);
				navigate(`/${id}`)
			}else{
				alert(detail.message);
			}
		}catch(error){
			console.log(error)
		}
	}

	// const HandleSearch_Dislpay = async(Type) =>{
	// 	setSearchType(Type)
	// }

	const navigate = useNavigate();
	const location = useLocation(); // Get the current location

	return(
		<div>
			<div className="HeaderBox">
				<img id="background" src={BackImg} alt="Backgound" />
				<img id="leftside" src={SideBarImg} alt="Sidebar" />
				<img id="rightside" src={SideBarImg} alt="Sidebar" />
				<img id="logo" src={SocialImg} alt="Logo" />
				<img id="upbar" src={UpBarImg} alt="Sidebar" />
				<div className="navbar">
					<Form className="d-flex form-container">
						<Form.Control
							type="search"
							placeholder="Search"
							className="search_bar"
							aria-label="Search"
							onChange={(e)=>{setSearchInput(e.target.value)}}
							onKeyDown={HandleKeyDown}
						/>
						<Button id="search_btn" variant="outline-success" onClick={HandleSearch}>Search</Button>
					</Form>
					{loading ? (
						<div>...</div> 
					):(
						(!islogin) ? (
							<div>
								<Button id="log_in" onClick={() => navigate('/login', { state: { action: 'login' } })} variant="outline-success">Log in</Button>
								<Button id="sign_up" onClick={() => navigate('/signup', { state: { action: 'signup' } })} variant="outline-success">Sign up</Button>
							</div>
						):(
							<div>
								<Button id="log_out" onClick={handleLogOut} >Log Out</Button>
							</div>
						)
					)}     
				</div>
			</div>     
			{location.pathname === '/' && <RetrieveCards cards={cards} source="home"/>} {/* source : allow differentiate betn multiple request for RetrieveCards*/}
			{location.pathname === '/search' && <Search search_result={searchOutput?.data} handle_click={HandleUser_Display} /> } {/*handleSearchType={HandleSearch_Dislpay} */}
			{/* {location.pathname === '/search' && <Search found_cards={searchCardOutput?.data?.found_cards} handle_click={handleUser_Display}/>} */}
			{/* {location.pathname === `/${user_id}` && </>}   */}
	  </div>   
	)
}


function SideBtn(){
	const navigate = useNavigate();
	return (
		<div className="bg-light border-right" id="sidebar-wrapper">
			<div id="side_option_table" className="list-group list-group-flush">
				<a href="/" onClick={() => navigate('/')} className="custom-list-group-item">Home</a>
				<a href="/upload" onClick={() => navigate('/upload')} className="custom-list-group-item">Upload</a>
				<a href="/profile" onClick={() => navigate('/profile')} className="custom-list-group-item">Profile</a>
				<a href="/notify" onClick={() => navigate('/notify')} className="custom-list-group-item">Notification</a>
				
				{/* {user_click="true" ? (
					<a href="/" onClick={() => navigate('/')} className="custom-list-group-item">Username</a>
				):(
					<></>
				)} */}
			</div>
		</div>
	);
};


function Search({ search_result ={} , handleclick }) {// handleSearchType

	const [searchType, setSearchType] = useState([]);

	const handleChange = (selected) => {
		setSearchType(selected.value);
	};

	return (
		<div>
			<Select
				className="form-control"
				name="search_type"
				id="search_type"
				options={[{ value: 'Person', label: 'Person' },{ value: 'Cards', label: 'Cards' }]}
				value={searchType}
				onChange={handleChange}
				// onClick={()=>handleSearchType(searchType)}
				placeholder="Search Type"
			/>
			<div className="search_result">
				{searchType==="Person"  ? (
					search_result?.found_users && search_result?.found_users?.length > 0 ? (
						search_result?.found_users.map((user) => (
							<div className="all_users" key={user._id}>
								<Card className="single_user" onClick={()=>handleclick(user._id)}>
									<img id="user_pic" src={user.image || user_photo} alt="user"/>
									<Card.Body>
										<Card.Title className="user_pro_name">{user.name}</Card.Title>
										<Card.Text className="user_name">@{user.name}</Card.Text>
									</Card.Body>
								</Card>
							</div>

						))
				  ) : (
					  <p id="no_UserFound">No users found...</p>
				  )
				):(
					<div id="searched_cards">{<RetrieveCards cards={search_result?.found_cards} source="search"/>}</div> //source : allow to differentiate betn multiple request for RetrieveCards
				)}
			</div>
		</div>
	);
}



export {SideBtn, Search, Header};