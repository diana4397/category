import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';
import { Button, CustomInput } from 'reactstrap';

export default class CustomMultiImage extends Component {
    constructor(props) {
        super(props);
        this.imageSelected = this.imageSelected.bind(this);
        this.onCurrentImageChange = this.onCurrentImageChange.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.state = {
            currentImage: 0,
            maxImages: this.props.maxImages || 10,
            images: this.props.defaultImages,
            deletedImages : []
        };
        //console.log("this.state.images--------------------",this.state.images);
    }
    
    onCurrentImageChange(index) {
        this.setState({ currentImage: index });
    }

    deleteImage() {
        let CurrentId = this.state.currentImage;
        const deletedImage = this.state.images[CurrentId];
        let images = this.state.images.slice();
        images.splice(CurrentId, 1);
        this.setState(
            {
                images: images,
            },
            () => {
                this.props.onImageChange(this.state.images, deletedImage);
            },
        );
    }

    onSelectImage(index, image) {
        var images = this.state.images.slice();
        var img = images[index];
        if (img.hasOwnProperty("isSelected"))
            img.isSelected = !img.isSelected;
        else
            img.isSelected = true;

        this.setState({
            images: images
        });
    }
    copyImage =()=>{
        var images  =[];
        console.log("this.state",this.state.images)
        // eslint-disable-next-line
        this.state.images && this.state.images.map(e=>{
            if(e.isSelected){
                images.push(e.src);
            }
        });
        this.props.onCopyImage(images);
    }
    deleteImageselected = ()=>{
        var images = [];
        // eslint-disable-next-line
        this.state.images && this.state.images.map(e=>{
            if(e.isSelected){
                images.push(e.id)
            }
        });
        this.props.ondelete(images);
    }
    imageSelected = event => {
        let futureImages = event.target.files.length + this.state.images.length;
        if (futureImages > this.state.maxImages) {
            event.target.value = null;
            return alert(
                `You can select maximum ${this.state.maxImages} images.`,
            );
        }

        Array.from(event.target.files).forEach(async file => {
            let b64str = await this.toBase64(file);
            let images = this.state.images;
            images = [
                ...images,
                {
                    src: b64str,
                    thumbnail: b64str,
                    thumbnailWidth: 100,
                    thumbnailHeight: 100,
                    file: file,
                },
            ];
            this.setState({ images: images }, () => {
                // const CurrentId = this.state.currentImage;
                // const CurrentImage = this.state.images[CurrentId];
                this.props.onImageChange(images, null);
            });
        });
        event.target.value = null;
    };

    toBase64 = file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

    render() {
        // console.log('GALLERY->', this);
        return (
            <>
                <Gallery
                    images={this.state.images}
                    enableImageSelection={true}
                    currentImageWillChange={this.onCurrentImageChange}
                    onSelectImage={this.onSelectImage}
                    customControls={[
                        <Button
                            className=""
                            key="deleteImage"
                            onClick={this.deleteImage}
                        >
                            <i className="icon-Delete-File simple-icon-trash"></i>
                        </Button>,
                    ]}
                />
                <div style={{ clear: 'both' }}>&nbsp;</div>
                {
                    this.state.images.length > 0 && (
                        <React.Fragment>
                            <div className="row">
                                <Button
                                    className="ml-3 mb-3"
                                    key="deleteImage"
                                    color="outline-primary"
                                    onClick={this.deleteImageselected}
                                >
                                    <i className="icon-Delete-File simple-icon-trash"></i>
                                </Button>
                            </div>
                        </React.Fragment>       
                    ) 
                }
                <CustomInput
                    id="_ImageGalleryUploadFile"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={this.imageSelected}
                />
                <div style={{ float: 'left', margin: '5px' }}>
                    {this.state.maxImages - this.state.images.length} images
                    left
                </div>
                <div style={{ clear: 'both' }}>&nbsp;</div>
            </>
        );
    }
}
