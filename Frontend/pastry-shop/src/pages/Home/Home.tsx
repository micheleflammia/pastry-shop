import React, { useState, useEffect } from "react";

import './Home.css';

import { API_URL } from "src/config";

import Header from 'src/components/Header/Header';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';


import axios from 'axios';

interface SweetCardData {
    id: string;
    nome: string;
    prezzo: string;
    data: string;
    quantita: number;
    ingredienti: string[];
}




const HomePage = () => {

    const [cards, setCards] = useState<SweetCardData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSweetCards = async (): Promise<SweetCardData[]> => {

        const response = await axios.get(`${API_URL}/sweets?available=true`);
       
        const data: SweetCardData[] =  response.data;
        return data;
    }

    useEffect(() => {
        console.log('fetch');
        const loadCards = async () => {
            try {
                
                const data = await fetchSweetCards();
                setCards(data);
            } catch (err) {
                setError((err as Error).name);
            } finally {
                setLoading(false);
            }
        };

        loadCards();
    }, []);

    if (loading) {
        return <div>Caricamento...</div>;
    }

    if (error) {
        return <div>Errore: {error}</div>;
    }

    
    const SweetCard: React.FC<SweetCardData> = ({ nome, prezzo, data, ingredienti }) => {

        return (
            <Card style={{ width: '13rem' }}>
                <Card.Body>
                    <Card.Title>{nome}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{prezzo}€</Card.Subtitle>
                    <Card.Text>
                        {data}
                    </Card.Text>
                    <ListGroup variant="flush">
                        {ingredienti.map((i) => <ListGroup.Item key={i}>{i}</ListGroup.Item>)}
                    </ListGroup>
    
                </Card.Body>
            </Card>
        );
    }

    return (
        <div>
            <Header />
            <div className="home-container">
                <div className="title-container">
                    <h4>Benvenuto!</h4>
                </div>

                <div className="card-container">
                    {cards.map((card) => (
                       
                        <SweetCard key={card.id} {...card} />
                    ))}
                </div>

            </div>
        </div>
    );
}

export default HomePage;