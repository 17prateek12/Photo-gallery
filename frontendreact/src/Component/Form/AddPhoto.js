import { useState } from 'react';
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const AddPhoto = ({ categories, onAddPhoto, handlecloseform }) => {
    // Define state variables for form inputs
    const [description, setDescription] = useState('');
    const [photoname, setPhotoname] = useState('');
    const [category, setCategory] = useState([]);
    const [image, setImage] = useState(null);
    const [newCategory, setNewCategory] = useState('');


    const handleFormSubmit = (e) => {
        e.preventDefault();

        console.log('Image:', image);
        if (!photoname || !description || (!category && !newCategory) || !image) {
            alert('Please fill in all required fields and select an image.');
            return;
        }

        let categoryIds;
        if (newCategory) {
            // Create a new category
            axios.post('http://127.0.0.1:8000/api/categories/', { name: newCategory }, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    const newCategoryId = res.data.id;
                    categoryIds = [newCategoryId];
                    const newPhoto = {
                        photoname,
                        description,
                        category: categoryIds,
                        image,
                        new_category_name: newCategory,
                    };

                    axios.post('http://127.0.0.1:8000/api/photos/', newPhoto, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                        .then((res) => {
                            console.log(res.data);
                            const addedPhoto = res.data;
                            onAddPhoto(addedPhoto);
                        })
                        .catch((error) => {
                            console.error('Error adding photo:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error adding category:', error);
                });
        } else {
            // Use the selected category directly
            categoryIds = category;
            const newPhoto = {
                photoname,
                description,
                category: categoryIds,
                image,
            };

            axios.post('http://127.0.0.1:8000/api/photos/', newPhoto, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((res) => {
                    console.log(res.data);
                    const addedPhoto = res.data;
                    onAddPhoto(addedPhoto);
                })
                .catch((error) => {
                    console.error('Error adding photo:', error);
                });
        }

        setPhotoname('');
        setDescription('');
        setCategory([]);
        setImage(null);
    };


    const handleCategoryChange = (event) => {
        const selectedCategories = event.target.value;
        setCategory(selectedCategories);
    };


    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
        >
            <div> <Typography variant="h6">ADD NEW PHOTO</Typography></div>
            <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <TextField
                        required
                        id="outlined-required"
                        value={photoname}
                        label="Photo Name"
                        onChange={(e) => setPhotoname(e.target.value)}
                    />
                </FormControl>
            </div>
            <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <TextField
                        required
                        multiline
                        rows={4}
                        id="outlined-multiline-static"
                        value={description}
                        label="Description"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormControl>
            </div>
            <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-simple-checkbox-label">Select a Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={category}
                        onChange={handleCategoryChange}

                        input={<OutlinedInput label="Select a Category" />}
                    >
                        {categories.map((categoryy) => (
                            <MenuItem key={categoryy.id} value={categoryy.id}>
                                <Checkbox checked={categories.indexOf(categoryy.name) > -1} />
                                <ListItemText primary={categoryy.name} />
                            </MenuItem>
                        ))}
                        <MenuItem value="reset" onClick={() => setCategory([])}>
                            none
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <TextField
                        id="outlined-required"
                        value={newCategory}
                        label="New Category"
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}

                    >
                        Upload file
                        <VisuallyHiddenInput
                            required
                            name="image"
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])} />
                        {console.log('Iamge', image)}

                    </Button>
                </FormControl>
            </div>
            <Button type="submit" variant="contained" onClick={handleFormSubmit}> SUBMIT</Button>
            <Button type="submit" variant="contained" onClick={handlecloseform} id="close">CLOSE</Button>
        </Box>
    );
};

export default AddPhoto;
