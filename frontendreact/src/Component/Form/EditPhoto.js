import React, { useState } from 'react';
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
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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


const EditPhoto = ({ photos, categories, onEditPhoto, handlecloseform }) => {
    // Define state variables for form inputs
    const [description, setDescription] = useState(photos.description || '');
    const [photoname, setPhotoname] = useState(photos.photoname || '');
    const [category, setCategory] = useState(photos.category || []);
    const [image, setImage] = useState(photos.image);
    console.log(photos.id)

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const editPhoto = {
            id: photos.id,
            photoname,
            description,
            category,
            image,
        };

        axios.put(`http://127.0.0.1:8000/api/photos/${editPhoto.id}/`, editPhoto, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })

            .then((res) => {
                console.log(res.data);
                const addedPhoto = res.data;
                onEditPhoto(addedPhoto);
                handlecloseform();
            })
            .catch((error) => {
                console.error('Error updating photo:', error);
            });

        setPhotoname('');
        setDescription('');
        setCategory([]);
        setImage();
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
            <div> <Typography variant="h6">EDIT PHOTO</Typography></div>
            <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <TextField
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
                        onChange={(e) => setCategory(e.target.value)}

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
            <Button type="submit" variant="contained" onClick={handleFormSubmit}>SUBMIT</Button>
            <Button type="submit" variant="contained" onClick={handlecloseform} id="close">CLOSE</Button>
        </Box>
    );
};

export default EditPhoto;
