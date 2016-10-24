var folderName = 'coeispacs2016';
var fileName;
var URL_proceeding = "http://ispacs2016.psu.ac.th/pdf/ISPACS2016-Proceeding.pdf";
var statusDom;
function downloadProceeding(){
	downloadFile("http://ispacs2016.psu.ac.th/pdf/ISPACS2016-Proceeding.pdf");
}

function downloadFile(URL) {
    //step to request a file system
    var filesys;
	var download_link = encodeURI(URL);
	statusDom = document.querySelector('#status');
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
	
    function fileSystemSuccess(fileSystem) {
        
        fileName = download_link.substr(download_link.lastIndexOf('/') + 1); //Get filename of URL
        
		var directoryEntry = fileSystem.root; // to get root path of directory
        filesys = fileSystem;
		directoryEntry.getDirectory(folderName, {
            create: true,
            exclusive: false
        }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
		
    }

    function onDirectorySuccess(parent) {
        // Directory created successfuly
		var rootdir = filesys.root;
        //var fp = rootdir.toNativeURL(); // Returns Fullpath of local directory
		var fp = filesys.root.toNativeURL();
        fp = fp + folderName + "/" + fileName; // fullpath and name of the file which we want to give
        // download function call
		//alert("SAVE to " + fp);
        filetransfer(download_link, fp);
    }

    function onDirectoryFail(error) {
        //Error while creating directory
        alert("Unable to create new directory: " + error.code);

    }

    function fileSystemFail(evt) {
        //Unable to access file system
        alert("File Syatem Fail" + evt.target.error.code);
    }
}

function filetransfer(download_link, fp) {
    var fileTransfer = new FileTransfer();
    // File download function with URL and local path
	fileTransfer.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			statusDom.innerHTML = perc + "% loaded...";
		} else {
			if(statusDom.innerHTML == "") {
				statusDom.innerHTML = "Loading";
			} else {
				statusDom.innerHTML += ".";
			}
		}
	};	
    fileTransfer.download(download_link, fp,
        function(entry) {
            alert("download complete: " + entry.fullPath);
			statusDom.innerHTML = entry.fullPath();
        },
        function(error) {
            //Download abort errors or download failed errors
            alert("download error source " + error.source);
        }
    );
}