import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import "../Assets/Style/upload.css";

function UploadCards() {
	const navigate = useNavigate();
	const [cards, setCards] = useState([]); // Cards to retrieve & show
	const [show, setShow] = useState(false);
	const [editMode, setEditMode] = useState(false); // Track edit mode
	const [currentCardId, setCurrentCardId] = useState(null); // Store current card id for edit

	const [newCard, setNewCard] = useState({ image: '', title: '', text: '' }); // Cards to store in DB
	const [imageFile, setImageFile] = useState(null);
		// const [title, setTitle] = useState('');
		// const [text, setText] = useState('');

	const handleClose = () => {
		setShow(false);
		setEditMode(false);
		setNewCard({ image: '', title: '', text: '' });
		setImageFile(null);
	};
	const handleShow = () => setShow(true);

	useEffect(() => {
		fetchCards();
	});

	const fetchCards = async () => {
		try {
			const response = await fetch('http://localhost:3000/upload', {
				method: 'GET',
				credentials: 'include'
			});

			if (response.ok) {
				const dataDB = await response.json();
				setCards(dataDB.data);
			} else {
				const errorData = await response.json(); // Get the error message from the response
				alert(errorData.message || 'Failed to retrieve cards'); // Alert the error message
				navigate("/")
			}

		} catch (error) {
			console.error('Error retrieving cards:', error);
		}
	};


	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === 'image') {
			setImageFile(files[0]);
			setNewCard({ ...newCard, [name]: URL.createObjectURL(files[0]) });
		} else {
			setNewCard({ ...newCard, [name]: value });
		}
	};

	const handleSubmit = async () => {
		const cardData = new FormData();
		cardData.append('image', imageFile);
		cardData.append('title', newCard.title);
		cardData.append('text', newCard.text);

		try {
			let response;
			if (editMode && currentCardId) {
				// Update existing card
				response = await fetch(`http://localhost:3000/upload/${currentCardId}`, {
					method: 'PUT',
					body: cardData,
					credentials: 'include'
				});
			} else {
				// Create new card
				response = await fetch('http://localhost:3000/upload', {
					method: 'POST',
					body: cardData,
					credentials: 'include'
				});
			}

			if (response.ok) {
				alert(editMode ? 'Card updated successfully' : 'Card uploaded successfully');
				fetchCards(); // Refresh cards list
				handleClose();
			} else {
				alert('Failed to save card');
			}
		} catch (error) {
			console.error('Error saving card:', error);
		}
	};

	const handleEdit = (card) => {
		setEditMode(true);
		setCurrentCardId(card._id);
		setNewCard({ title: card.title, text: card.text, image: card.image });
		handleShow();
	};

	const handleDelete = async (cardId) => {

		try {
			const response = await fetch(`http://localhost:3000/upload/${cardId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				alert('Card deleted successfully');
				setCards(cards.filter((card) => card._id !== cardId)); // Remove from state
			} else {
				alert('Failed to delete card');
			}
		} catch (error) {
			console.error('Error deleting card:', error);
		}
	};

	return (
		<div>
			<Button id="create_btn" onClick={handleShow}>Create</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>{editMode ? 'Edit Card' : 'Create Card'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formImage">
							<Form.Label>Image</Form.Label>
							<Form.Control type="file" name="image" onChange={handleChange} required />
						</Form.Group>
						<Form.Group controlId="formTitle">
							<Form.Label>Title</Form.Label>
							<Form.Control type="text" name="title" value={newCard.title} onChange={handleChange} required />
						</Form.Group>
						<Form.Group controlId="formText">
							<Form.Label>Text</Form.Label>
							<Form.Control type="text" name="text" value={newCard.text} onChange={handleChange} />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleSubmit}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
			<RetrieveCards cards={cards} source="upload" handleEdit={handleEdit} handleDelete={handleDelete} />
		</div>
	);
}

function RetrieveCards({ cards, source, handleEdit, handleDelete }) {
	return (
		<div className="card_table">
			{cards?.length > 0 ? (
				cards.map((card, index) => (
					<Card key={index} className="uploaded_card" style={{ width: '18rem', margin: '10px' }}>
						<Card.Img variant="top" src={card.image} />
						<Card.Body>
							<Card.Title>{card.title}</Card.Title>
							<Card.Text>{card.text}</Card.Text>
						</Card.Body>
						{source === 'upload' && (  // Only show edit and delete buttons for "upload" source
							<div className="update">
								<Button className="edit" onClick={() => handleEdit(card)}>Edit</Button>
								<Button className="delete" onClick={() => handleDelete(card._id)}>Delete</Button>
							</div>
						)}
					</Card>
				))
			) : (
				<p id="loadMsg" >...</p>
			)}
		</div>
	);
}

export { UploadCards, RetrieveCards };
