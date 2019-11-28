import React, { useState, useEffect } from 'react';

import ImageSource from '../../assets/img/nf teste.jpg';
import { Container, Button } from 'reactstrap'
import { CustomInput, Form, FormGroup, Label } from 'reactstrap';

const ImageManipulation = () => {
  const TO_RADIANS = Math.PI / 180;
  const PERCENT_SIZE_PLUS = 0.3;
  const DEFAULT_DEGREE_ROTATION = 5
  const DEFAULT_ZOOM_STEP = 5
  const [imgSrc, setImgSrc] = useState()
  const [imageSize, setImageSize] = useState({})
  const [imagePosition, setImagePosition] = useState({})
  const [translatePosition, setTanslatePosition] = useState({})
  const [degreeRotationImage, setDegreeRotationImage] = useState(0)
  const [percentZoomImage, setPercentZoomImage] = useState(100)
  
  useEffect(() => {
    init()
  }, [])

  function init() {
    var image = new Image();

    image.onload = () => {
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext("2d");

      const maxDim = Math.max(image.width, image.height)
      
      canvas.setAttribute('width', maxDim + (maxDim * PERCENT_SIZE_PLUS));
      canvas.setAttribute('height', maxDim + (maxDim * PERCENT_SIZE_PLUS)) ;

      const imgPosition = {
        x: (canvas.width - image.width) / 2, 
        y: (canvas.height - image.height) / 2,
      }

      context.drawImage(image, imgPosition.x, imgPosition.y);

      setImageSize({ 
          width: image.width, 
          height: image.height
        }
      )
      setImagePosition(imgPosition)
      setTanslatePosition({ 
          x: (canvas.width / 2), 
          y: (canvas.height / 2)
        }
      )
    }

    image.src = ImageSource
  }

  async function rotateImage(degree) {
    const rotation = degree * TO_RADIANS;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var image = new Image();
   
    image.onload = async () => {
      context.save();
      context.clearRect(0, 0 , canvas.width, canvas.height);
      context.translate(translatePosition.x, translatePosition.y);
      context.rotate(rotation);
      context.translate(-translatePosition.x, -translatePosition.y);
      context.drawImage(image, imagePosition.x, imagePosition.y); //draw the image ;)
      context.restore();

      const base64 = await canvas.toDataURL("image/jpeg", 1.0);

      setImgSrc(base64); 
    }

    image.src = ImageSource;
  }

  const rotationImage = async (degree) => {
    var newDegreeRotationImage = degree === 0 ? 0 : degreeRotationImage + degree;

    if (newDegreeRotationImage <= -360) {
      newDegreeRotationImage = 360 + newDegreeRotationImage;
    }
    else if (newDegreeRotationImage >= 360) {
      newDegreeRotationImage = newDegreeRotationImage - 360;
    }
    
    setDegreeRotationImage(newDegreeRotationImage)
    rotateImage(newDegreeRotationImage)
  }

  const onResetRotation = async () => {
    var newDegreeRotationImage = 0;

    setDegreeRotationImage(newDegreeRotationImage)
    rotateImage(newDegreeRotationImage)
    
    setImgSrc(ImageSource);
  }

  const onRightRotation = async () => {
    rotationImage(DEFAULT_DEGREE_ROTATION)
  }

  const onLeftRotation = async () => {
    rotationImage(- DEFAULT_DEGREE_ROTATION)
  }

  const onRigth90Rotation = async () => {
    rotationImage(90)
  }

  const onLeft90Rotation = async () => {
    rotationImage(-90)
  }

  const zoomImage = (zoomValue) => {
    var image = new Image();
   
    image.onload = async () => {
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext("2d");

      context.save();
      context.clearRect(0, 0 , canvas.width, canvas.height);
      context.translate(translatePosition.x, translatePosition.y);
      context.scale(zoomValue/100, zoomValue/100);
      context.translate(-translatePosition.x, -translatePosition.y);
      context.drawImage(image, imagePosition.x, imagePosition.y); //draw the image ;)
      context.restore();

      const base64 = await canvas.toDataURL("image/jpeg", 1.0);

      setImgSrc(base64); 
    }

    image.src = ImageSource;
  }

  const onZoomImage = (zoomValue) => {
    var newZoomImage = percentZoomImage + zoomValue

    if (newZoomImage < 0) {
      newZoomImage = 0
    }
    else if (newZoomImage > 200) {
      newZoomImage = 200
    }

    setPercentZoomImage(newZoomImage)
    //zoomImage(newZoomImage)
  }

  const onZoomMinus = async () => {
    onZoomImage(-DEFAULT_ZOOM_STEP)
  }

  const onZoomPlus = async () => {
    onZoomImage(DEFAULT_ZOOM_STEP)
  }

  return (
    <Container fluid  className="h-100 w-100" >
      <hr />
      <div>
        <div>
          <Button 
            size="md" 
            color="primary" 
            type="button" 
            onClick={onZoomMinus}
            className="mr-2">
              <i class="fas fa-search-minus"></i>
          </Button>
          <Button 
            size="md" 
            color="primary" 
            type="button" 
            onClick={onZoomPlus}
            className="mr-2">
              <i class="fas fa-search-plus"></i>
          </Button>
        </div>
        <div>
          <img src={ImageSource}
            style={{transform: `scale(${percentZoomImage/100}, ${percentZoomImage/100})`}}/>
        </div>
      </div>
      <hr />
      <div>
        <Form inline>
          <Button 
            size="md" 
            color="primary" 
            type="button" 
            onClick={onLeftRotation}
            className="mr-2">
              <i className="fas fa-undo-alt"></i>
          </Button>
          <Button 
            size="md" 
            color="primary" 
            type="button" 
            onClick={onResetRotation}
            className="mr-2">Reset
          </Button>
          <Button 
            size="md" 
            color="primary" 
            type="button" 
            onClick={onRightRotation}
            className="mr-2">
              <i className="fas fa-redo-alt"></i>
          </Button>
          <Button 
            size="md" 
            color="primary" 
            type="button" 
            onClick={onLeft90Rotation}
            className="mr-2">-90
          </Button>
          <Button 
            size="md" 
            color="primary" 
            type="button" 
            onClick={onRigth90Rotation}
            className="mr-2">+90
          </Button>
          <FormGroup className="mr-2">
            <Label for="rangeDegree">Graus {degreeRotationImage}</Label>
            <CustomInput 
              type="range" 
              id="rangeDegree" 
              name="rangeDegree" 
              onChange={e => rotationImage(e.target.valueAsNumber)}
              min="-360"
              max="360"
              minLength="-360"
              maxLength="360"
              incremental="true"
              step={DEFAULT_DEGREE_ROTATION}
              defaultValue="0"
              value={degreeRotationImage}/>
          </FormGroup>
        </Form>
      </div>
      <hr />
      <>
        | imageSize: {imageSize.width} - {imageSize.height} {" "}
      </>
      <>
        | imagePosition: {imagePosition.x} - {imagePosition.y} {" "}
      </>
      <>
        | translatePosition: {translatePosition.x} - {translatePosition.y} {" "}
      </>
      <>
        | zoom: {percentZoomImage} {" "}
      </>
      <div className="h-100 w-100">
        <canvas id="canvas" className="border"/>
      </div>
      <hr />
    </Container>
  )
}

export default ImageManipulation