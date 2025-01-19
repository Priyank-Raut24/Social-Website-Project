import React,{useState} from "react";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import "../Assets/Style/detail.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function Detail() {
    const navigate=useNavigate();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [ph_no, setPh_no] = useState('');
    const [birth_date, setBirth_date] = useState('');
    const [gender, setGender] = useState('');
    const [interest, setInterest] = useState('');
    const [about, setAbout] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const profileData = {
            name,
            age,
            ph_no,
            birth_date,
            gender,
            interest,
            about,
        };
    
        try {
            const response = await fetch('http://localhost:3000/details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies with requests
                body: JSON.stringify(profileData)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log(data.message);
            navigate("/"); 
        } catch (error) {
            console.error('Error updating profile:', error.message);
        }
    };
    
    
    
    const [selectedOptions, setSelectedOptions] = useState([]);

    const options = [
        { value: 'gaming', label: 'Gaming' },
        { value: 'singing', label: 'Singing' },
        { value: 'swimming', label: 'Swimming' },
        { value: 'reading', label: 'Reading' },
        { value: 'traveling', label: 'Traveling' },
        { value: 'cooking', label: 'Cooking' },
        { value: 'photography', label: 'Photography' },
        { value: 'music', label: 'Music' },
        { value: 'sports', label: 'Sports' },
        { value: 'fitness', label: 'Fitness' },
        { value: 'movies', label: 'Movies' },
        { value: 'technology', label: 'Technology' },
        { value: 'art', label: 'Art' },
        { value: 'writing', label: 'Writing' },
        { value: 'dancing', label: 'Dancing' },
        { value: 'hiking', label: 'Hiking' },
        { value: 'yoga', label: 'Yoga' },
        { value: 'gardening', label: 'Gardening' },
        { value: 'fishing', label: 'Fishing' },
        { value: 'crafts', label: 'Crafts' },
        { value: 'animals', label: 'Animals' },
        { value: 'history', label: 'History' },
        { value: 'politics', label: 'Politics' },
        { value: 'philosophy', label: 'Philosophy' },
        { value: 'science', label: 'Science' },
        { value: 'languages', label: 'Languages' },
        { value: 'education', label: 'Education' },

    ];

    const handleChange = (selected) => {
        setSelectedOptions(selected);
        const selectedValues = selected.map(option => option.value); // Extracting the values
        setInterest(selectedValues.join(', ')); // Join values as a string
    };
    
    return (
        <div className="detail_form_div"> 
            <form className="detail_form" method="get" onSubmit={handleSubmit}>
                <h4>Fill <span>Details</span></h4>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input name="name" type="text" className="form-control" placeholder="" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input name="age" type="number" className="form-control" placeholder="" value={age} onChange={(e) => setAge(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="pho_no">Phone Number</label>
                        <input name="ph_no" type="number" className="form-control" placeholder="XXXXXXXXXX" value={ph_no} onChange={(e) => setPh_no(e.target.value)}/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="date_birth">Date of Birth</label>
                        <input name="birth_date" type="date" className="form-control" value={birth_date} onChange={(e) => setBirth_date(e.target.value)}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select name="gender" className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="-">-</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Not Sure">Not Sure</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="interests">Select Your Interests:</label>
                        <Select
                            className="form-control"
                            name="interest"
                            id="interests"
                            isMulti
                            options={options}
                            value={selectedOptions}
                            onChange={handleChange}
                            placeholder="Select interests"
                        />
                    </div>
                </div>
                <div className="form-group col-lg-12">
                    <label htmlFor="userDescription">About Yourself</label>
                    <textarea
                        name="about"
                        id="user_about"
                        rows="4"
                        placeholder="Tell us about yourself..."
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="btn-box">
                    <button type="submit" className="btn btn-primary">Submit Now</button>
                </div>
            </form>
        </div>
    );
}

export default Detail;
