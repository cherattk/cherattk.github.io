/**
 * 
 */
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

function copyFile(sourcePath, destinationPath) {
  return new Promise((resolve, reject) => {
    fs.copyFile(sourcePath, destinationPath, (err) => {
      if (err) {
				console.error(`Error copying file ${err}`);
        reject(err);
      } else {
				console.log(`File copied to ${destinationPath}`);
        resolve();
      }
    });
  });
}

function copyDirectory(sourcePath, destinationPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(destinationPath, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        fs.readdir(sourcePath, (err, files) => {
          if (err) {
            reject(err);
          } else {
            Promise.all(
              files.map((file) => {
                const sourceFile = path.join(sourcePath, file);
                const destinationFile = path.join(destinationPath, file);
                return fs.stat(sourceFile).then((stats) => {
                  if (stats.isDirectory()) {
                    return copyDirectory(sourceFile, destinationFile);
                  } else {
                    return copyFile(sourceFile, destinationFile);
                  }
                });
              })
            )
              .then(() => resolve())
              .catch((error) => {
								console.error('Error:', error.message);
							});
          }
        });
      }
    });
  });
}

function copyResources(resourcePath , sourcePath , destinationPath){
		const relativePath = resourcePath.replaceAll('\\', '/').replace(sourcePath, '');
		const destinationFilePath = path.join(destinationPath, relativePath);
		
		fs.stat(resourcePath, (err, stats) => {
			if(err){
				console.error(err.message);
				return;
			}
		  if (stats.isDirectory()) {
				copyDirectory(resourcePath, destinationFilePath)
		      .then(() => console.log(`Successfully copying Directory: ${relativePath}`))
		      .catch((err) => console.error(`Error copying directory: ${err}`));
		  } else {
		    copyFile(resourcePath, destinationFilePath)
		      .then(() => console.log(`Successfully copying file: ${relativePath}`))
		      .catch((err) => console.error(`Error copying file: ${err}`));
		  }
		});
}

function watchAndCopy(sourcePath, destinationPath , regexIgnoreFileAndDir) {
  const watcher = chokidar.watch(sourcePath, {
    ignoreInitial: true,
    persistent: true,
		ignored : new RegExp(regexIgnoreFileAndDir)
  });

  watcher.on('add', (resourcePath) => {
		console.log(`File added: ${resourcePath}`);
    copyResources(resourcePath , sourcePath , destinationPath);
  });

  watcher.on('change', (resourcePath) => {
    // Handle file changes if needed
    console.log(`File changed: ${resourcePath}`);
		copyResources(resourcePath , sourcePath , destinationPath);
  });

  watcher.on('unlink', (resourcePath) => {
    // Handle file deletions if needed
    const relativePath = resourcePath.replace(sourcePath, '');
    const destinationFilePath = path.join(destinationPath, relativePath);
    fs.unlink(destinationFilePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      } else {
        console.log(`File deleted: ${relativePath}`);
      }
    });
  });
}

const sourcePath = 'src/static/';
const destinationPath = 'dist/static';

watchAndCopy(sourcePath, destinationPath , 'src/js/');  // exlude js