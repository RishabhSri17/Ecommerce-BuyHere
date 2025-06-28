const path = require('path');
const fs = require('fs');

const deleteFile = filePath => {
  const imagePath = path.join(path.resolve(), filePath);

  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, error => {
      if (error) {
        throw new Error(error.message);
      }
      console.log('File deleted!');
    });
  } else {
    console.log('Image does not exits');
  }
};

module.exports = { deleteFile };
