import React, { useState, useEffect } from 'react';

import './Office.css';

import { API_URL } from 'src/config';

import Header from 'src/components/Header/Header';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

interface SweetItem {
    id: string;
    nome: string;
    prezzo: string;
    data: string;
    quantita: number;
    ingredienti: string[];
}


const OfficePage = () => {


    const [items, setItems] = useState<SweetItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [show, setShow] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    const [nome, setNome] = useState<string>("");
    const [prezzo, setPrezzo] = useState<number>(0);
    const [data, setData] = useState<string>("");
    const [quantita, setQuantita] = useState<number>(0);
    const [ingredienti, setIngredienti] = useState<string[]>([]);

    const [editId, setEditId] = useState<string>("");
    const [editNome, setEditNome] = useState<string>("");
    const [editPrezzo, setEditPrezzo] = useState<number>(0);
    const [editData, setEditData] = useState<string>("");
    const [editQuantita, setEditQuantita] = useState<number>(0);
    const [editIngredienti, setEditIngredienti] = useState<string[]>([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleShowUpdate = () => setShowUpdate(true);
    const handleCloseUpdate = () => setShowUpdate(false);

    const fetchAllSweets = async () => {
        const response = await axios.get(`${API_URL}/sweets`);

        const data: SweetItem[] = response.data;

        return data;
    }

    const loadItems = async () => {
        try {
            const data = await fetchAllSweets();
            setItems(data);
        } catch (err) {
            setError((err as Error).name);
        } finally {
            setLoading(false);
        }
    };

    const loadEditItem = (id: string) => {

        axios.get(`${API_URL}/sweets/${id}`)
        .then(({data}) => {
            setEditId(data.id);
            setEditNome(data.nome);
            setEditPrezzo(data.prezzo);
            setEditQuantita(data.quantita);
            setEditData(data.data);
            setEditIngredienti(data.ingredienti);
        })
        .catch((error) => {
            toast.error(error.message);
        })
    }

    useEffect(() => {

        loadItems();
    }, []);

    if (loading) {
        return <div>Caricamento...</div>;
    }

    if (error) {
        return <div>Errore: {error}</div>;
    }

    const handleEdit = (id: string) => {
        loadEditItem(id);

        handleShowUpdate();
    
    }

    const handleSaveEdit = () => {

        const data = {
            nome : editNome,
            prezzo : editPrezzo,
            quantita : editQuantita,
            data : editData,
            ingredienti : editIngredienti,
        };

        axios.put(`${API_URL}/sweets/${editId}`, data)
        .then((response) => {
            if(response.status === 200){
                loadItems();
                toast.success(`${editNome} modificato con successo`);
            }
        })
        .catch((error) => {
            toast.error(error.message);
        })

        handleCloseUpdate();

    }

    const handleAddNew = () => {

        const newOne = {
            nome: nome,
            prezzo: prezzo,
            quantita: quantita,
            data: data,
            ingredienti: ingredienti

        }
     
        axios.post(`${API_URL}/sweets`, newOne)
            .then((response) => {
                if (response.status === 201) {
                    toast.success("Nuovo dolce aggiunto");
                    loadItems();
                }
            })
            .catch((error) => {
                toast.error(error.message);
            })

        handleClose();
    }

    const handleDelete = (id: string, name: string) => {

        if (window.confirm(`Sei sicuro di voler eliminare ${name}?`) === true) {

            axios.delete(`${API_URL}/sweetss/${id}`)
                .then((result) => {
                    if (result.status === 204) {
                        toast.success('Eliminato con successo')
                        loadItems();
                    }
                })
                .catch((error) => {
                    
                    toast.error(error.message)
                }) 
        }
    }

    const handleIngredientiChange = (data: string): string[] => {
        let array = data.split(',');

        return array;
    }

    const clear = () => {
        setNome("");
        setPrezzo(0);
        setData("");
        setQuantita(0);
        setIngredienti([]);

        setEditNome("");
        setEditPrezzo(0);
        setEditData("");
        setEditQuantita(0);
        setEditIngredienti([]);
    }

    return (
        <div>
            <Header />
            <div className='office-container'>
                <ToastContainer/>
                    <button onClick={() => handleShow()} style={{ margin: "10px 0" }} className='btn btn-primary'>Aggiungi nuovo</button>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nome</th>
                                <th>Prezzo</th>
                                <th>Quantita</th>
                                <th>Data</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>

                            {items.map((item, index) => {
                                return (

                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.nome}</td>
                                        <td>{item.prezzo}€</td>
                                        <td>{item.quantita}</td>
                                        <td>{item.data}</td>
                                        <td colSpan={2}>
                                            <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Modifica</button> &nbsp;
                                            <button className='btn btn-danger' onClick={() => handleDelete(item.id, item.nome)}>Elimina</button>
                                        </td>
                                    </tr>
                                )
                            })}


                        </tbody>
                    </Table>
                    
                    <Modal show={showUpdate} onHide={handleCloseUpdate}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modifica</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="string" value={editNome} onChange={(val) => setEditNome(val.target.value)} />
                                    <Form.Label>Prezzo</Form.Label>
                                    <Form.Control type="number" value={editPrezzo} onChange={(val) => setEditPrezzo(Number(val.target.value))} />
                                    <Form.Label>Data</Form.Label>
                                    <Form.Control type="string" value={editData} onChange={(val) => setEditData(val.target.value)} />
                                    <Form.Label>Quantita</Form.Label>
                                    <Form.Control type="number" value={editQuantita} onChange={(val) => setEditQuantita(Number(val.target.value))} />
                                    <Form.Label>Ingredienti</Form.Label>
                                    <Form.Control type="string" value={editIngredienti} onChange={(val) => setEditIngredienti(handleIngredientiChange(val.target.value))} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseUpdate}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSaveEdit}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Aggiungi</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="string" onChange={(val) => setNome(val.target.value)} />
                                    <Form.Label>Prezzo</Form.Label>
                                    <Form.Control type="number" onChange={(val) => setPrezzo(Number(val.target.value))} />
                                    <Form.Label>Data</Form.Label>
                                    <Form.Control type="string" onChange={(val) => setData(val.target.value)} />
                                    <Form.Label>Quantita</Form.Label>
                                    <Form.Control type="number" onChange={(val) => setQuantita(Number(val.target.value))} />
                                    <Form.Label>Ingredienti</Form.Label>
                                    <Form.Control type="string" onChange={(val) => setIngredienti(handleIngredientiChange(val.target.value))} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleAddNew}>
                                Add new
                            </Button>
                        </Modal.Footer>
                    </Modal>
            </div>
        </div>
    );
}

export default OfficePage;