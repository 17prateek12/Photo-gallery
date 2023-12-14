import { useState, useEffect, useContext } from 'react';
import classes from "./Gallery.module.css";
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import { Modal, Fade } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddPhoto from './Form/AddPhoto';
import Box from '@mui/material/Box';
import EditPhoto from './Form/EditPhoto';
import axios from 'axios';
import ThemeIcon from './Context/ThemeIcon';
import ThemeContext from './Context/ThemeContext';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';




const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openPhoto, setOpenPhoto] = useState(null);
    const [cards, setCards] = useState(null);
    const [showAddPhotoForm, setShowAddPhotoForm] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const { darkMode } = useContext(ThemeContext);
    const [sortingOption, setSortingOption] = useState('datetime'); // Initial sorting option



    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/photos/')
            .then(res => {
                setPhotos(res.data)
                console.log(res.data)
            })
            .catch((error) => {
                console.error('Error fetching photos:', error);
            })
    }, []);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/categories/')
            .then(res => {
                setCategories(res.data)
                // console.log(res.data)
            });

    }, []);

    //To close photo detail card

    const handleClose = () => {
        setOpenPhoto(null);
        setCards(null);
    };

    //To open photo full screen 

    const onViewClick = (photo) => {
        setOpenPhoto(photo);
    };

    //To delete photo  

    const onDeleteClick = (photoId) => {
        axios
            .delete(`http://127.0.0.1:8000/api/photos/${photoId}/`)
            .then((response) => {
                if (response.status === 204) {
                    const updatedPhotos = photos.filter((photo) => photo.id !== photoId);
                    setPhotos(updatedPhotos);
                }
            })
            .catch((error) => {
                console.error('Error deleting photo:', error);
            });

    };

    //To delete photo and category 

    const onDeleteCategoryClick = (categoryId) => {
        axios
            .delete(`http://127.0.0.1:8000/api/categories/${categoryId}/`)
            .then((response) => {
                if (response.status === 204) {
                    const updatedCategories = categories.filter((category) => category.id !== categoryId);
                    setCategories(updatedCategories);

                    const updatedPhotos = photos.filter((photo) => photo.category !== categoryId);
                    setPhotos(updatedPhotos);
                }
            })
            .catch((error) => {
                console.error('Error deleting category:', error);
            });
    };


    //To open photo detail card
    const details = (photo) => {
        setCards(photo);
    }

    //To open edit photo form 

    const onEditClick = (photo) => {
        setSelectedPhoto(photo)
    };

    //To update photo

    const handleditphoto = (editedPhoto) => {
        const updatedPhotos = photos.map((photo) =>
            photo.id === editedPhoto.id ? editedPhoto : photo
        );
        setPhotos(updatedPhotos);

    }

    //To close full screen photo  

    const handleCloseEdit = () => {
        setSelectedPhoto(null);
    };


    //To open add photo form 

    const onAddPhotoClick = () => {
        setShowAddPhotoForm(!showAddPhotoForm);
    };

    //To open add photo in Galley

    const handleAddPhoto = (addedPhoto) => {
        setPhotos([...photos, addedPhoto]);
        setShowAddPhotoForm(false);
    };

    //To close add photo form 

    const handlecloseform = (close) => {
        setShowAddPhotoForm(false);
    };

    //To sort the photos according to name or by defualt date and time 

    const handleSortingOptionChange = (event) => {
        setSortingOption(event.target.value);
    };


    const comparePhotos = (photoA, photoB) => {
        const datetimeA = new Date(photoA.upload_datetime);
        const datetimeB = new Date(photoB.upload_datetime);

        if (datetimeA < datetimeB) {
            return -1;
        } else if (datetimeA > datetimeB) {
            return 1;
        } else {
            return photoA.photoname.localeCompare(photoB.photoname);
        }
    };


    const sortedPhotos = [...photos].sort((a, b) => {
        if (sortingOption === 'name') {
            return a.photoname.localeCompare(b.photoname);
        } else {
            return comparePhotos(a, b);
        }
    });

    useEffect(() => {
        setPhotos(sortedPhotos);
    }, [sortingOption, sortedPhotos]);

    //To Filter the photos according to Category wise 

    const filterPhotos = (category) => {

        if (category === null) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category.id);
        }
    };

    const filteredPhotos = selectedCategory === null
        ? photos
        : photos.filter((photo) => photo.category === selectedCategory);


    return (
        <div className={` ${darkMode ? classes.darkmode : classes.lightmode}`}>
            <div className={classes.column1}>
                <div className={classes.card}>
                    <Stack direction="column" spacing={2} className={classes.ulli}>
                        <Button onClick={() => filterPhotos(null)} sx={{ fontSize: 22, color: 'white' }}>
                            ALL
                        </Button>
                    </Stack>

                    {categories.map((category) => (
                        <Stack direction="column" key={category.id} className={classes.ulbutton}>
                            <Button variant="contained"
                                onClick={() => filterPhotos(category)}
                                className={`${selectedCategory === category.id ? 'active' : ''}`}
                                sx={{ fontSize: 16, width: '60%' }}
                            >
                                {category.name}
                            </Button>
                            <IconButton>
                                <HighlightOffOutlinedIcon
                                    onClick={() => onDeleteCategoryClick(category.id)}

                                    className={classes.iconnn}
                                />
                            </IconButton>
                        </Stack>
                    ))}
                    <Stack className={classes.addphotobutton}>
                        <Button onClick={onAddPhotoClick} sx={{ color: 'white', fontSize: 20 }} >
                            ADD PHOTO
                        </Button>
                    </Stack>
                    <Stack className={classes.ttextt}>
                        <Select
                            value={sortingOption}
                            onChange={handleSortingOptionChange}
                            sx={{ color: 'white', fontSize: 20 }}
                        >
                            <MenuItem value="datetime">Date and Time</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                        </Select>
                    </Stack>
                </div>

            </div>
            <div className={classes.column2}>
                <div >
                    <h1 className={classes.ttext}>Django React App</h1>
                    <ThemeIcon />
                    <ImageList variant="masonry" cols={3} gap={8}>
                        {filteredPhotos.map((photo) => (
                            <ImageListItem key={photo.id}>
                                <img
                                    srcSet={`${photo.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${photo.image}?w=248&fit=crop&auto=format`}
                                    alt={photo.photoname}
                                    onDoubleClick={(e) => onViewClick(photo)}
                                    loading="lazy"
                                    className={classes.image}
                                />
                                <ImageListItemBar
                                    title={photo.photoname}
                                    actionIcon={
                                        <IconButton>
                                            <HighlightOffOutlinedIcon
                                                className={classes.iconn}
                                                onClick={() => onDeleteClick(photo.id)}
                                            />
                                            <EditIcon className={classes.iconn}
                                                onClick={() => onEditClick(photo)}
                                            />
                                            <InfoIcon
                                                className={classes.iconn}
                                                onClick={() => details(photo)}
                                            >
                                            </InfoIcon>
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </div>
            </div>
            {openPhoto && (
                <div onClick={handleClose}>
                    <Modal className={classes.modal} open={openPhoto}>
                        <Fade in={openPhoto} timeout={500} className={classes.img}>
                            <img
                                src={openPhoto.image}
                                alt={openPhoto.photoname}
                                style={{ maxHeight: "95%", maxWidth: "95%" }}
                            />
                        </Fade>
                    </Modal>
                </div>
            )}
            {cards && (
                <div onDoubleClick={handleClose}>
                    <Modal className={classes.modal1} open={true}>
                        <Fade in={cards} timeout={500}>
                            <Card sx={{ width: 350 }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18 }}>
                                        <b>Photo Name:</b> {cards.photoname} <br />
                                        <b> Category:</b> {cards.category}   <br />
                                        <b> Description:</b> {cards.description}<br />
                                        <b> Time of creation:</b> {cards.upload_datetime}
                                    </Typography>

                                </CardContent></Card>
                        </Fade>
                    </Modal>
                </div>
            )}
            {showAddPhotoForm && (
                <div>
                    <Modal className={classes.modal2} open={true}>
                        <Box className={classes.form}>
                            <AddPhoto

                                categories={categories}
                                onAddPhoto={handleAddPhoto}
                                handlecloseform={handlecloseform}
                            />
                        </Box>
                    </Modal>
                </div>
            )}
            {selectedPhoto && (
                <div >
                    <Modal className={classes.modal2} open={true}>
                        <Box className={classes.form}>
                            <EditPhoto
                                photos={selectedPhoto}
                                categories={categories}
                                onEditPhoto={handleditphoto}
                                handlecloseform={handleCloseEdit}
                            />
                        </Box>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default Gallery;
